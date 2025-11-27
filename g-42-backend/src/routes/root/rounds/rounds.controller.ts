import { FastifyInstance } from "fastify";
import { Op } from "sequelize";

import { initModels } from "./rounds.models";
import type { Round, Tap } from "./rounds.models";
import { UserRole, type User } from "../users/users.models";

export async function mkRoundsController(fastify: FastifyInstance) {
  const sequelize = fastify.sequelize;
  const { Round, Tap, User } = await initModels(sequelize);

  return {
    findAllRounds: async function (): Promise<Round[]> {
      return await Round.findAll({
        order: [["end", "DESC"]],
      });
    },

    findRoundById: async function (roundId: string): Promise<Round | null> {
      return await Round.findByPk(roundId);
    },

    createRound: async function (user: User): Promise<Round | null> {
      // only user with role Admin can create a round
      if (user.role !== UserRole.Admin) {
        return null;
      }

      const newRoundStart = new Date(
        Date.now() + fastify.config.COOLDOWN_DURATION * 1000,
      );
      newRoundStart.setMilliseconds(0);

      const newRoundEnd = new Date(newRoundStart);
      newRoundEnd.setSeconds(
        newRoundStart.getSeconds() + fastify.config.ROUND_DURATION,
      );

      return await Round.create({
        start: newRoundStart,
        end: newRoundEnd,
        totalScore: 0,
      });
    },

    myScore: async function (user: User, roundId: string): Promise<Tap | null> {
      const round = await Round.findByPk(roundId);

      // round with this id doesn't exist
      if (!round) {
        return null;
      }

      const [tap, _created] = await Tap.findOrCreate({
        where: { userId: user.id, roundId: roundId },
        defaults: {
          userId: user.id,
          roundId: round.id,
          score: 0,
          count: 0,
        },
      });

      return tap;
    },

    winner: async function (
      roundId: string,
    ): Promise<{ users: User[]; score: number } | null> {
      const round = await Round.findByPk(roundId);

      // round with this id doesn't exist
      if (!round) {
        return null;
      }

      const now = Date.now();
      const roundEnd = round.end.getTime();

      // do nothing if round isn't running
      if (now < roundEnd) {
        return null;
      }

      const maxScoreInRound: number | undefined = await Tap.max("score", {
        where: { roundId },
      });

      if (!maxScoreInRound || maxScoreInRound === 0) {
        return { users: [], score: 0 };
      }

      const winnerIds = (
        await Tap.findAll({
          where: {
            [Op.and]: [{ roundId }, { score: maxScoreInRound }],
          },
        })
      ).map((tap) => tap.userId);

      const winners = await User.findAll({
        attributes: ["id", "username", "role"],
        where: {
          id: winnerIds,
        },
      });

      return { users: winners, score: maxScoreInRound };
    },

    makeTap: async function (user: User, roundId: string): Promise<Tap | null> {
      const round = await Round.findByPk(roundId);

      // round with this id doesn't exist
      if (!round) {
        return null;
      }

      const [tap, _created] = await Tap.findOrCreate({
        where: { userId: user.id, roundId: roundId },
        defaults: {
          userId: user.id,
          roundId: round.id,
          score: 0,
          count: 0,
        },
      });

      switch (user.role) {
        // it's Nikita, do nothing
        case UserRole.Nikita: {
          return tap;
        }
        case UserRole.Survival:
        case UserRole.Admin: {
          const now = Date.now();
          const roundStart = round.start.getTime();
          const roundEnd = round.end.getTime();

          // do nothing if round isn't running
          if (now < roundStart || now > roundEnd) {
            return null;
          }

          const transaction = await sequelize.transaction();
          try {
            await tap.reload({ transaction, lock: transaction.LOCK.UPDATE });
            const scoreInc = tap.count !== 0 && tap.count % 10 === 0 ? 11 : 1;
            tap.score = tap.score + scoreInc;
            const newCount = tap.count + 1;
            tap.count = newCount;
            await tap.save({ transaction });

            await round.reload({ transaction, lock: transaction.LOCK.UPDATE });
            round.totalScore = round.totalScore + scoreInc;
            await round.save({ transaction });

            await transaction.commit();

            return tap;
          } catch {
            await transaction.rollback();
            return null;
          }
        }
      }
    },
  };
}
