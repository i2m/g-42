import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { mkTapsController } from "./taps.controller";
import { MyScoreSchema, TapSchema, WinnerSchema } from "./taps.schema";

const tapsPlugin: FastifyPluginAsync = async (fastify) => {
  const TapsController = await mkTapsController(fastify);

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/tap/:roundId",
      { ...TapSchema, preHandler: [fastify.authenticate] },
      async (request, reply) => {
        const user = request.user;
        const roundId = request.params.roundId;

        const tap = await TapsController.countTap(user, roundId);

        if (!tap) {
          return reply.internalServerError("Unable to count the tap");
        }

        return reply.send(tap);
      },
    );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get(
      "/myScore/:roundId",
      { ...MyScoreSchema, preHandler: [fastify.authenticate] },
      async (request, reply) => {
        const user = request.user;
        const roundId = request.params.roundId;

        const tap = await TapsController.myScore(user, roundId);

        if (!tap) {
          return reply.internalServerError("Unable to find score");
        }

        return reply.send(tap);
      },
    );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get(
      "/winner/:roundId",
      { ...WinnerSchema, preHandler: [fastify.authenticate] },
      async (request, reply) => {
        const roundId = request.params.roundId;
        const user = await TapsController.winner(roundId);

        if (!user) {
          return reply.internalServerError("Unable to find winner");
        }

        return reply.send(user);
      },
    );
};

export default tapsPlugin;
