import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import {
  RoundCreateSchema,
  RoundFindByIdSchema,
  RoundListSchema,
} from "./rounds.schema";
import { mkRoundsController } from "./rounds.controller";

const roundsPlugin: FastifyPluginAsync = async (fastify) => {
  const RoundsController = await mkRoundsController(fastify);

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get(
      "/list",
      { ...RoundListSchema, preHandler: [fastify.authenticate] },
      async (_request, reply) => {
        return reply.send(await RoundsController.findAllRounds());
      },
    );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .get(
      "/find/:id",
      { ...RoundFindByIdSchema, preHandler: [fastify.authenticate] },
      async (request, reply) => {
        const round = await RoundsController.findRoundById(request.params.id);
        if (!round) {
          return reply.notFound("Round not found");
        }
        return reply.send(round);
      },
    );

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/create",
      { ...RoundCreateSchema, preHandler: [fastify.authenticate] },
      async (request, reply) => {
        const round = await RoundsController.createRound(request.user);
        if (!round) {
          return reply.forbidden();
        }
        return reply.send(round);
      },
    );
};

export default roundsPlugin;
