import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";
import { SWAGGER_TAGS } from "@/lib/constants/swagger-tags.js";
import { basicResponseSchema } from "@/lib/common-schemas.js";
import { authTokensSchema, loginSchema } from "./schemas.js";

export default async (instance: FastifyInstance) => {
  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "GET",
    url: "/check",
    schema: {
      tags: [SWAGGER_TAGS.auth.name],
      response: {
        200: basicResponseSchema,
      },
    },
    handler: async (_request, reply) => {
      return reply.send({ statusCode: 200, message: "OK" });
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      tags: [SWAGGER_TAGS.users.name, SWAGGER_TAGS.auth.name],
      body: loginSchema,
      response: {
        200: authTokensSchema,
        400: basicResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const user = await instance.authService.getAuthenticatedUser(
        request.body.username,
        request.body.password
      );

      const accessToken = await reply.accessJwtSign({ id: user.id });
      const refreshToken = await reply.refreshJwtSign({ id: user.id });

      return reply
        .setCookie("refreshToken", refreshToken, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        })
        .send({ accessToken });
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    withRefresh: true,
    method: "POST",
    url: "/refresh",
    schema: {
      tags: [SWAGGER_TAGS.auth.name],
      response: {
        200: authTokensSchema,
      },
    },
    handler: async (request, reply) => {
      const accessToken = await reply.accessJwtSign({ id: request.user.id });
      const refreshToken = await reply.refreshJwtSign({ id: request.user.id });

      return reply
        .setCookie("refreshToken", refreshToken, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        })
        .send({ accessToken });
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/logout",
    schema: {
      tags: [SWAGGER_TAGS.auth.name],
      response: {
        200: basicResponseSchema,
      },
    },
    handler: async (_request, reply) => {
      return reply
        .clearCookie("refreshToken", {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        })
        .send({
          statusCode: 200,
          message: "OK",
        });
    },
  });
};
