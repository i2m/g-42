import { join } from "node:path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync, FastifyServerOptions } from "fastify";

import { rootPlugin, rootPluginWS } from "./routes/root";

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  // Loads all plugins defined in plugins folder
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  fastify.register(rootPlugin, {
    prefix: "/api/v1",
    ...opts,
  });

  fastify.register(rootPluginWS, {
    prefix: "/websocket",
    ...opts,
  });
};

export default app;
export { app, options };
