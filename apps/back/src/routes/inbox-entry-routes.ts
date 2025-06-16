import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";
import { SWAGGER_TAGS } from "@/lib/constants/swagger-tags.js";
import {
  inboxEntryCreateOrUpdateSchema,
  inboxEntrySelectSchema,
} from "@/schemas/inbox-entry-schemas.js";
import {
  createUserInboxEntry,
  deleteUserInboxEntry,
  getUserInboxEntries,
  getUserInboxEntryById,
  updateUserInboxEntry,
} from "@/repository/inbox-entry-repository.js";

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
    handler: async (request) => {
      return getUserInboxEntries(request.user.id);
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "GET",
    url: "/:id",
    schema: {
      tags: [SWAGGER_TAGS.inboxEntries.name],
      params: inboxEntrySelectSchema.pick({ id: true }),
      response: {
        200: inboxEntrySelectSchema,
      },
    },
    handler: async (request) => {
      return getUserInboxEntryById(request.params.id, request.user.id);
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
    handler: async (request) => {
      return createUserInboxEntry(request.user.id, {
        title: request.body.title,
      });
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
    handler: async (request) => {
      return updateUserInboxEntry(request.params.id, request.user.id, {
        title: request.body.title,
      });
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
    handler: async (request) => {
      return deleteUserInboxEntry(request.params.id, request.user.id);
    },
  });
};
