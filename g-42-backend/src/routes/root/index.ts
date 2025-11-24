import { FastifyPluginAsync } from "fastify";
import usersPlugin from "./users/users.plugin";
import roundsPlugin from "./rounds/rounds.plugin";
import tapsPlugin from "./taps/taps.plugin";

const rootPlugin: FastifyPluginAsync = async (fastify): Promise<void> => {
  // just simple health check
  fastify.get("/", async function (_request, reply) {
    return reply.send("ok");
  });

  fastify.register(usersPlugin, { prefix: "/users" });
  fastify.register(roundsPlugin, { prefix: "/rounds" });
  fastify.register(tapsPlugin, { prefix: "/taps" });
};

export default rootPlugin;
