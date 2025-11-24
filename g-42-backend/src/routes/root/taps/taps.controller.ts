import { FastifyInstance } from "fastify";

import { initModels } from "./taps.models";
import type { Tap } from "./taps.models";
import { User, UserRole } from "../users/users.models";

export async function mkTapsController(fastify: FastifyInstance) {
  const sequelize = fastify.sequelize;
  const { Tap, Round, User } = await initModels(sequelize);

  return {
    myScore: async function (user: User, roundId: string): Promise<Tap | null> {
      const round = await Round.findByPk(roundId);

      // round with this id doesn't exist
      if (!round) {
        return null;
      }

      const [tap, _created] = await Tap.findOrCreate({
        where: { UserId: user.id, RoundId: roundId },
        defaults: {
          UserId: user.id,
          RoundId: round.id,
          score: 0,
          count: 0,
        },
      });

      return tap;
    },

    winner: async function (roundId: string): Promise<User | null> {
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

      const tap = await Tap.findOne({
        order: [["score", "DESC"]],
        where: { RoundId: roundId },
      });

      // round with this id doesn't exist
      if (!tap) {
        return null;
      }

      return await User.findByPk(tap.UserId);
    },

    countTap: async function (
      user: User,
      roundId: string,
    ): Promise<Tap | null> {
      const round = await Round.findByPk(roundId);

      // round with this id doesn't exist
      if (!round) {
        return null;
      }

      const [tap, _created] = await Tap.findOrCreate({
        where: { UserId: user.id, RoundId: roundId },
        defaults: {
          UserId: user.id,
          RoundId: round.id,
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
            await tap.reload({ transaction });
            const scoreInc = tap.count !== 0 && tap.count % 10 === 0 ? 11 : 1;
            tap.score = tap.score + scoreInc;
            const newCount = tap.count + 1;
            tap.count = newCount;
            await tap.save({ transaction });

            await round.reload({ transaction });
            round.totalScore = round.totalScore + scoreInc;
            await round.save({ transaction });

            await transaction.commit();

            return tap;
          } catch {
            return null;
          }
        }
      }
    },
  };
}
