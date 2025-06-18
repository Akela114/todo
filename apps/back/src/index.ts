import "./env";

import Fastify from "fastify";
import cookiePlugin from "@fastify/cookie";
import databaseClientPlugin from "./db/client.js";
import swaggerPlugin from "./plugins/swagger.js";
import jwtPlugin from "./plugins/jwt.js";

import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import routes from "./routes/index.js";
import { ValidationError } from "./lib/errors/bad-request-error.js";
import services from "./services/index.js";
import repository from "./repository/index.js";

const fastify = Fastify({
  logger: true,
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.register(cookiePlugin);

fastify.register(swaggerPlugin);

fastify.register(databaseClientPlugin);

fastify.register(jwtPlugin);

fastify.setErrorHandler((error, _request, reply) => {
  if (error instanceof ValidationError) {
    return reply.status(400).send({
      statusCode: 400,
      message: error.message,
    });
  }

  reply.status(500).send({
    statusCode: 500,
    message: error.message,
  });
});

fastify.register(repository);
fastify.register(services);
fastify.register(routes, { prefix: "/api" });

const startFastify = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startFastify();
