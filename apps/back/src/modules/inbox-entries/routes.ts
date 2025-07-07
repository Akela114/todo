import { SWAGGER_TAGS } from "@/lib/constants/swagger-tags.js";
import {
  basePaginatedRequestParams,
  coreApiBasicResponseSchema,
} from "@packages/schemas/common";
import {
  createOrModifyInboxEntrySchema,
  inboxEntrySchema,
  paginatedInoxEntries,
} from "@packages/schemas/inbox-entry";
import {
  createOrModifyTaskSchemaBack,
  taskSchema,
} from "@packages/schemas/task";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export default async (instance: FastifyInstance) => {
  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "GET",
    url: "/",
    schema: {
      tags: [SWAGGER_TAGS.inboxEntries.name],
      querystring: basePaginatedRequestParams,
      response: {
        200: paginatedInoxEntries,
      },
    },
    handler: async (request) => {
      const res = await instance.inboxEntryService.getAllPaginated(
        {
          userId: request.user.id,
        },
        {
          page: request.query.page,
          pageSize: request.query.pageSize,
        },
      );

      return res;
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "POST",
    url: "/",
    schema: {
      tags: [SWAGGER_TAGS.inboxEntries.name],
      body: createOrModifyInboxEntrySchema,
      response: {
        201: inboxEntrySchema,
      },
    },
    handler: async (request, reply) => {
      const inboxEntry = await instance.inboxEntryService.create(
        {
          userId: request.user.id,
        },
        {
          title: request.body.title,
        },
      );

      return reply.status(201).send(inboxEntry);
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "PUT",
    url: "/:id",
    schema: {
      tags: [SWAGGER_TAGS.inboxEntries.name],
      params: inboxEntrySchema.pick({ id: true }),
      body: createOrModifyInboxEntrySchema,
      response: {
        200: inboxEntrySchema,
      },
    },
    handler: (request) => {
      return instance.inboxEntryService.update(
        {
          id: request.params.id,
          userId: request.user.id,
        },
        {
          title: request.body.title,
        },
      );
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "DELETE",
    url: "/:id",
    schema: {
      tags: [SWAGGER_TAGS.inboxEntries.name],
      params: inboxEntrySchema.pick({ id: true }),
      response: {
        200: coreApiBasicResponseSchema,
      },
    },
    handler: async (request) => {
      await instance.inboxEntryService.delete({
        id: request.params.id,
        userId: request.user.id,
      });

      return { statusCode: 200, message: "OK" };
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "POST",
    url: "/:id/tasks",
    schema: {
      tags: [SWAGGER_TAGS.inboxEntries.name, SWAGGER_TAGS.tasks.name],
      params: inboxEntrySchema.pick({ id: true }),
      body: createOrModifyTaskSchemaBack,
      response: {
        201: taskSchema,
      },
    },
    handler: async (request, reply) => {
      const task = await instance.tasksService.convertInboxEntryToTask({
        ...request.body,
        inboxEntryId: request.params.id,
        userId: request.user.id,
      });

      return reply.status(201).send(task);
    },
  });
};
