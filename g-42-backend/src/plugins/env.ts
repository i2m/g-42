import fp from "fastify-plugin";
import fastifyEnv from "@fastify/env";

export interface EnvPluginOptions {}

export default fp<EnvPluginOptions>((fastify, _options, done) => {
  const schema = {
    type: "object",
    required: ["ROUND_DURATION", "COOLDOWN_DURATION"],
    properties: {
      ROUND_DURATION: {
        type: "number",
        default: 60,
      },
      COOLDOWN_DURATION: {
        type: "number",
        default: 30,
      },
      SALT_ROUNDS: {
        type: "number",
        default: 10,
      },
      JWT_SECRET: {
        type: "string",
        default: "IMPORTANT_CHANGE_THIS",
      },
      COOKIE_SECRET: {
        type: "string",
        default: "IMPORTANT_CHANGE_THIS",
      },
      POSTGRES_PASSWORD: {
        type: "string",
        default: "postgres",
      },
      POSTGRES_USER: {
        type: "string",
        default: "postgres",
      },
      POSTGRES_DB: {
        type: "string",
        default: "g42",
      },
      POSTGRES_HOST: {
        type: "string",
        default: "localhost",
      },
    },
  };

  const configOptions = {
    confKey: "config",
    schema: schema,
    data: process.env,
    dotenv: true,
  };

  return fastifyEnv(fastify, configOptions, done);
});

declare module "fastify" {
  export interface FastifyInstance {
    config: {
      ROUND_DURATION: number;
      COOLDOWN_DURATION: number;
      SALT_ROUNDS: number;
      JWT_SECRET: string;
      COOKIE_SECRET: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_USER: string;
      POSTGRES_DB: string;
      POSTGRES_HOST: string;
    };
  }
}
