import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";
import { SWAGGER_TAGS } from "@/lib/constants/swagger-tags.js";
import {
  inboxEntryCreateOrUpdateSchema,
  inboxEntrySelectSchema,
} from "./schemas.js";
import { taskCreateSchema, taskSelectSchema } from "../tasks/schemas.js";

export default async (instance: FastifyInstance) => {
  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "GET",
    url: "/",
    schema: {
      tags: [SWAGGER_TAGS.inboxEntries.name],
      response: {
        200: inboxEntrySelectSchema.array(),
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
      body: inboxEntryCreateOrUpdateSchema,
      response: {
        201: inboxEntrySelectSchema,
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
      params: inboxEntrySelectSchema.pick({ id: true }),
      body: inboxEntryCreateOrUpdateSchema,
      response: {
        200: inboxEntrySelectSchema,
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
      params: inboxEntrySelectSchema.pick({ id: true }),
      response: {
        200: inboxEntrySelectSchema,
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
      params: inboxEntrySelectSchema.pick({ id: true }),
      body: taskCreateSchema,
      response: {
        201: taskSelectSchema,
      },
    },
    handler: async (request, reply) => {
      const task = await instance.inboxEntryService.convertInboxEntryToTask({
        id: request.params.id,
        userId: request.user.id,
        title: request.body.title,
      });

      return reply.status(201).send(task);
    },
  });
};
