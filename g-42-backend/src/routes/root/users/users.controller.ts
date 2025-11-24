import { FastifyInstance } from "fastify";

import { detectUserRole, initModels } from "./users.models";
import type { User } from "./users.models";
import { compareHash } from "./users.utils";

export async function mkUsersController(fastify: FastifyInstance) {
  const sequelize = fastify.sequelize;
  const { User } = await initModels(sequelize, fastify.config.SALT_ROUNDS);

  return {
    findUser: async function (
      username: string,
      password: string,
    ): Promise<User | null> {
      const [user, created] = await User.findOrCreate({
        where: { username },
        defaults: {
          username,
          password,
          role: detectUserRole(username),
        },
      });

      const isEqualHash = await compareHash(
        password,
        user.getDataValue("password"),
      );
      if (created || isEqualHash) {
        return user;
      }
      return null;
    },
  };
}
