import { SWAGGER_TAGS } from "@/lib/constants/swagger-tags.js";
import { basicResponseSchema } from "@/lib/common-schemas.js";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { userCreateSchema, userSelectSchema } from "./schemas.js";

export default async (instance: FastifyInstance) => {
  instance.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/",
    schema: {
      tags: [SWAGGER_TAGS.users.name],
      body: userCreateSchema,
      response: {
        201: userSelectSchema,
        400: basicResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const user = await instance.usersService.createWithPasswordGeneration(
        request.body
      );

      return reply.status(201).send(user);
    },
  });
};
