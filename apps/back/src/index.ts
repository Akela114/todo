import "./env";

import cookiePlugin from "@fastify/cookie";
import Fastify from "fastify";
import databaseClientPlugin from "./db/client.js";
import jwtPlugin from "./plugins/jwt.js";
import swaggerPlugin from "./plugins/swagger.js";

import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { ValidationError } from "./lib/errors/bad-request-error.js";
import { ConflictError } from "./lib/errors/conflict-error.js";
import { NotFoundError } from "./lib/errors/not-found-error.js";
import modules from "./modules/index.js";

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
  console.log(error);

  if (error.statusCode) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      message: error.message,
    });
  }

  if (error instanceof ValidationError) {
    return reply.status(400).send({
      statusCode: 400,
      message: error.message,
    });
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({
      statusCode: 404,
      message: error.message,
    });
  }

  if (error instanceof ConflictError) {
    return reply.status(409).send({
      statusCode: 409,
      message: error.message,
    });
  }

  reply.status(500).send({
    statusCode: 500,
    message: error.message,
  });
});

fastify.register(modules, {
  prefix: "/api",
});

const startFastify = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startFastify();
