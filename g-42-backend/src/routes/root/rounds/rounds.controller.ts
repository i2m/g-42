import { FastifyInstance } from "fastify";

import { initModels } from "./rounds.models";
import type { Round } from "./rounds.models";
import { UserRole, type User } from "../users/users.models";

export async function mkRoundsController(fastify: FastifyInstance) {
  const sequelize = fastify.sequelize;
  const { Round } = await initModels(sequelize);

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
  };
}
