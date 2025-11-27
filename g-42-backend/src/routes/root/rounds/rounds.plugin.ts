import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import {
  MyScoreSchema,
  RoundCreateSchema,
  RoundFindByIdSchema,
  RoundListSchema,
  TapSchema,
  WinnerSchema,
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
      "/find/:roundId",
      { ...RoundFindByIdSchema, preHandler: [fastify.authenticate] },
      async (request, reply) => {
        const round = await RoundsController.findRoundById(
          request.params.roundId,
        );
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

  fastify
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/tap/:roundId",
      { ...TapSchema, preHandler: [fastify.authenticate] },
      async (request, reply) => {
        const user = request.user;
        const roundId = request.params.roundId;

        const tap = await RoundsController.makeTap(user, roundId);

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

        const tap = await RoundsController.myScore(user, roundId);

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
        const winner = await RoundsController.winner(roundId);

        if (!winner) {
          return reply.internalServerError("Unable to find winner");
        }

        return reply.send(winner);
      },
    );
};

export default roundsPlugin;
