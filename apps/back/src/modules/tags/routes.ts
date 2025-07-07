import { SWAGGER_TAGS } from "@/lib/constants/swagger-tags.js";
import { coreApiBasicResponseSchema } from "@packages/schemas/common";
import {
  createOrModifyTagSchema,
  tagSchema,
  tagsQueryParamsSchema,
} from "@packages/schemas/tag";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export default async (instance: FastifyInstance) => {
  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "GET",
    url: "/",
    schema: {
      tags: [SWAGGER_TAGS.tags.name],
      querystring: tagsQueryParamsSchema,
      response: {
        200: tagSchema.array(),
      },
    },
    handler: (request) => {
      return instance.tagsService.getAll({
        userId: request.user.id,
        query: request.query.query,
        activeTagIds: request.query.activeTagIds,
        startFrom: request.query.startFrom,
      });
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "POST",
    url: "/",
    schema: {
      tags: [SWAGGER_TAGS.tags.name],
      body: createOrModifyTagSchema,
      response: {
        201: tagSchema,
      },
    },
    handler: async (request, reply) => {
      const result = await instance.tagsService.create(
        { userId: request.user.id },
        request.body,
      );

      return reply.status(201).send(result);
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "PUT",
    url: "/",
    schema: {
      tags: [SWAGGER_TAGS.tags.name],
      params: tagSchema.pick({ id: true }),
      body: createOrModifyTagSchema,
      response: {
        200: tagSchema,
      },
    },
    handler: (request) => {
      return instance.tagsService.update(
        { id: request.params.id, userId: request.user.id },
        request.body,
      );
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "DELETE",
    url: "/:id",
    schema: {
      tags: [SWAGGER_TAGS.tags.name],
      params: tagSchema.pick({ id: true }),
      response: {
        200: coreApiBasicResponseSchema,
      },
    },
    handler: async (request) => {
      await instance.tagsService.delete({
        id: request.params.id,
        userId: request.user.id,
      });

      return { statusCode: 200, message: "OK" };
    },
  });
};
