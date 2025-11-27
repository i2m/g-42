import { FastifyPluginAsync } from "fastify";
import { mkRoundsController } from "./rounds.controller";
import { ErrorMessage, MakeTapMessage, TapMessage } from "./rounds.schema";

const tapsPluginWS: FastifyPluginAsync = async (fastify) => {
  const RoundsController = await mkRoundsController(fastify);

  fastify.get(
    "/",
    {
      websocket: true,
      preHandler: [fastify.authenticate],
    },
    (websocket, request) => {
      websocket.on("message", async (rawMessage) => {
        const user = request.user;
        const rawMessageObj = JSON.parse(rawMessage.toString());
        const message = MakeTapMessage.parse(rawMessageObj);

        switch (message.type) {
          case "MakeTap": {
            const roundId = message.data.roundId;
            const tap = await RoundsController.makeTap(user, roundId);
            if (tap !== null) {
              const response = TapMessage.parse({
                type: "Tap",
                data: tap,
              });
              websocket.send(JSON.stringify(response));
            }
            break;
          }

          default:
            const response = ErrorMessage.parse({
              type: "Error",
              data: { message: `Unknown message type: ${message.type}` },
            });
            websocket.send(JSON.stringify(response));
        }
      });
    },
  );
};

export default tapsPluginWS;
