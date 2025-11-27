import { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { UserLoginSchema } from "./users.schema";
import { mkUsersController } from "./users.controller";

const usersPlugin: FastifyPluginAsync = async (fastify) => {
  const UsersController = await mkUsersController(fastify);

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post("/login", UserLoginSchema, async (request, reply) => {
      const { username, password } = request.body;
      const user = await UsersController.findUser(username, password);

      if (user == null) {
        return reply.unauthorized();
      }

      const { password: _p, ...userWithoutPassword } = user.get();

      const accessToken = request.jwt.sign(userWithoutPassword);
      reply.setCookie(fastify.accessTokenCookieName, accessToken, {
        path: "/",
        httpOnly: true,
        secure: "auto",
      });

      return reply.send({ ...userWithoutPassword, accessToken });
    });

  fastify.post(
    "/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const user = await UsersController.findUserById(request.user.id);
      if (!user) {
        return reply.unauthorized();
      }
      const { password: _p, ...userWithoutPassword } = user.get();
      return reply.send(userWithoutPassword);
    },
  );

  fastify.post(
    "/logout",
    { preHandler: [fastify.authenticate] },
    async (_request, reply) => {
      reply.clearCookie(fastify.accessTokenCookieName);
      return reply.send({ message: "Logout successful" });
    },
  );
};

export default usersPlugin;
