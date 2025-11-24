import fp from "fastify-plugin";
import fjwt, { FastifyJWT, JWT } from "@fastify/jwt";
import fcookie from "@fastify/cookie";
import type { FastifyReply, FastifyRequest } from "fastify";

import { User } from "../routes/root/users/users.models";

const accessTokenCookieName = "access_token";

export default fp(async (fastify) => {
  fastify.register(fjwt, { secret: fastify.config.JWT_SECRET });

  fastify.addHook("preHandler", (request, _response, next) => {
    request.jwt = fastify.jwt;
    return next();
  });

  fastify.register(fcookie, {
    secret: fastify.config.COOKIE_SECRET,
    hook: "preHandler",
  });

  fastify.decorate("accessTokenCookieName", accessTokenCookieName);

  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const accessToken = request.cookies[accessTokenCookieName];

      if (!accessToken) {
        return reply.status(401).send({ message: "Authentication required" });
      }

      const decoded = request.jwt.verify<FastifyJWT["user"]>(accessToken);
      request.user = decoded;
    },
  );
});

declare module "fastify" {
  export interface FastifyRequest {
    jwt: JWT;
  }
  export interface FastifyInstance {
    authenticate: any;
    accessTokenCookieName: string;
  }
}

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: User;
  }
}
