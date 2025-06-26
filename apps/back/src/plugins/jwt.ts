import { valueToArray } from "@/lib/utils/value-to-array.js";
import fastifyJwt, { type VerifyPayloadType } from "@fastify/jwt";
import {
  type CoreApiBasicResponse,
  coreApiBasicResponseSchema,
} from "@packages/schemas/common";
import type { RouteOptions } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<VerifyPayloadType | null>;
    refresh: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<VerifyPayloadType | null>;
  }

  interface FastifyRequest {
    accessJwtVerify: FastifyRequest["jwtVerify"];
    accessJwtDecode: FastifyRequest["jwtDecode"];
    refreshJwtVerify: FastifyRequest["jwtVerify"];
    refreshJwtDecode: FastifyRequest["jwtDecode"];
  }

  interface FastifyReply {
    accessJwtSign: FastifyReply["jwtSign"];
    refreshJwtSign: FastifyReply["jwtSign"];
  }

  interface RouteOptions {
    withAuth?: boolean;
    withRefresh?: boolean;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: number };
    user: { id: number };
  }
}

export default fp((instance, _options, done) => {
  instance.register(fastifyJwt, {
    secret: "access_token_secret",
    namespace: "access",
    sign: {
      expiresIn: "5m",
    },
  });

  instance.register(fastifyJwt, {
    secret: "refresh_token_secret",
    namespace: "refresh",
    cookie: {
      cookieName: "refreshToken",
      signed: false,
    },
    sign: {
      expiresIn: "7d",
    },
  });

  instance.decorate("authenticate", async (request, reply) => {
    try {
      return await request.accessJwtVerify();
    } catch (err) {
      return reply.status(401).send({
        statusCode: 401,
        message: "Unauthorized",
      } satisfies CoreApiBasicResponse);
    }
  });

  instance.decorate("refresh", async (request, reply) => {
    try {
      return await request.refreshJwtVerify();
    } catch (err) {
      return reply.status(401).send({
        statusCode: 401,
        message: "Unauthorized",
      } satisfies CoreApiBasicResponse);
    }
  });

  instance.addHook("onRoute", (routeOptions: RouteOptions) => {
    if (routeOptions.withAuth) {
      routeOptions.onRequest = [
        ...valueToArray(routeOptions.onRequest),
        instance.authenticate,
      ];
      routeOptions.schema = {
        ...routeOptions.schema,
        response: {
          ...(routeOptions.schema?.response ?? {}),
          401: coreApiBasicResponseSchema,
        },
        security: [
          ...valueToArray(routeOptions.schema?.security),
          { bearerAuth: [] },
        ],
      };
    }
  });

  instance.addHook("onRoute", (routeOptions: RouteOptions) => {
    if (routeOptions.withRefresh) {
      routeOptions.onRequest = [
        ...valueToArray(routeOptions.onRequest),
        instance.refresh,
      ];
      routeOptions.schema = {
        ...routeOptions.schema,
        response: {
          ...(routeOptions.schema?.response ?? {}),
          401: coreApiBasicResponseSchema,
        },
        security: [...valueToArray(routeOptions.schema?.security)],
      };
    }
  });

  done();
});
