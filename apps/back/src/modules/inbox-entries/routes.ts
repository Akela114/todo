import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";
import { SWAGGER_TAGS } from "@/lib/constants/swagger-tags.js";
import {
  createOrModifyInboxEntrySchema,
  inboxEntrySchema,
} from "@packages/schemas/inbox-entry";
import {
  taskSchema,
  createTaskFromInboxEntrySchema,
} from "@packages/schemas/task";

export default async (instance: FastifyInstance) => {
  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "GET",
    url: "/",
    schema: {
      tags: [SWAGGER_TAGS.inboxEntries.name],
      response: {
        200: inboxEntrySchema.array(),
      },
    },
    handler: (request) => {
      return instance.inboxEntryService.getAll({
        userId: request.user.id,
      });
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
      const inboxEntry = await instance.inboxEntryService.create({
        title: request.body.title,
        userId: request.user.id,
      });

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
        request.params.id,
        {
          userId: request.user.id,
        },
        {
          title: request.body.title,
        }
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
        200: inboxEntrySchema,
      },
    },
    handler: (request) => {
      return instance.inboxEntryService.delete(request.params.id, {
        userId: request.user.id,
      });
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "POST",
    url: "/:id/tasks",
    schema: {
      tags: [SWAGGER_TAGS.inboxEntries.name, SWAGGER_TAGS.tasks.name],
      params: inboxEntrySchema.pick({ id: true }),
      body: createTaskFromInboxEntrySchema,
      response: {
        201: taskSchema,
      },
    },
    handler: async (request, reply) => {
      const task = await instance.inboxEntryService.convertInboxEntryToTask({
        id: request.params.id,
        userId: request.user.id,
        title: request.body.title,
        priority: request.body.priority,
      });

      return reply.status(201).send(task);
    },
  });
};
