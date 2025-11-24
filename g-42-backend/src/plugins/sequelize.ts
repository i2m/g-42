import fp from "fastify-plugin";
import { Sequelize } from "sequelize";

export interface SequelizePluginOptions {}

export default fp<SequelizePluginOptions>((fastify, _options, done) => {
  if (fastify.sequelize) {
    return done();
  }

  const sequelize = new Sequelize(
    fastify.config.POSTGRES_DB,
    fastify.config.POSTGRES_USER,
    fastify.config.POSTGRES_PASSWORD,
    {
      host: fastify.config.POSTGRES_HOST,
      dialect: "postgres",
    },
  );

  fastify.addHook("onClose", (fastify, done) => {
    if (fastify.sequelize === sequelize) {
      sequelize
        .close()
        .then(() => done())
        .catch(done);
    }
  });

  fastify.decorate("sequelize", sequelize);

  return sequelize
    .authenticate()
    .then(() => done())
    .catch(done);
});

declare module "fastify" {
  export interface FastifyInstance {
    sequelize: Sequelize;
  }
}
