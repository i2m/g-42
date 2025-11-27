import { FastifyPluginAsync } from "fastify";
import usersPlugin from "./users/users.plugin";
import roundsPlugin from "./rounds/rounds.plugin";
import roundsPluginWS from "./rounds/rounds.plugin-ws";

export const rootPlugin: FastifyPluginAsync = async (
  fastify,
): Promise<void> => {
  // just simple health check
  fastify.get("/", async function (_request, reply) {
    return reply.send("ok");
  });

  fastify.register(usersPlugin, { prefix: "/users" });
  fastify.register(roundsPlugin, { prefix: "/rounds" });
};

export const rootPluginWS: FastifyPluginAsync = async (
  fastify,
): Promise<void> => {
  fastify.register(roundsPluginWS, { prefix: "/rounds" });
};
