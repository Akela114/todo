import { SWAGGER_TAGS } from "@/lib/constants/swagger-tags.js";
import { basicResponseSchema } from "@/schemas/common-schemas.js";
import { userCreateSchema, userSelectSchema } from "@/schemas/user-schemas.js";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

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
      const user = await instance.userService.createUserService(request.body);

      return reply.status(201).send(user);
    },
  });
};
