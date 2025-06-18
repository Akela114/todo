import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";
import { SWAGGER_TAGS } from "@/lib/constants/swagger-tags.js";
import {
  inboxEntryCreateOrUpdateSchema,
  inboxEntrySelectSchema,
} from "./schemas.js";

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
      return instance.inboxEntryRepository.getUserInboxEntries(request.user.id);
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
    handler: (request) => {
      return instance.inboxEntryRepository.getUserInboxEntryById(
        request.params.id,
        request.user.id
      );
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
    handler: (request) => {
      return instance.inboxEntryRepository.createUserInboxEntry(
        request.user.id,
        {
          title: request.body.title,
        }
      );
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
      return instance.inboxEntryRepository.updateUserInboxEntry(
        request.params.id,
        request.user.id,
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
      return instance.inboxEntryRepository.deleteUserInboxEntry(
        request.params.id,
        request.user.id
      );
    },
  });
};
