import { SWAGGER_TAGS } from "@/lib/constants/swagger-tags.js";
import { coreApiBasicResponseSchema } from "@packages/schemas/common";
import { createUserSchema, userSchema } from "@packages/schemas/user";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export default async (instance: FastifyInstance) => {
  instance.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      tags: [SWAGGER_TAGS.users.name],
      body: createUserSchema,
      response: {
        201: userSchema,
        400: coreApiBasicResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const user = await instance.usersService.createWithPasswordGeneration(
        request.body,
      );

      return reply.status(201).send(user);
    },
  });
};
