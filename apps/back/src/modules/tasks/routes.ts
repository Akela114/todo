import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";
import { SWAGGER_TAGS } from "@/lib/constants/swagger-tags.js";
import { taskSelectSchema, taskUpdateSchema } from "../tasks/schemas.js";

export default async (instance: FastifyInstance) => {
  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "GET",
    url: "/",
    schema: {
      tags: [SWAGGER_TAGS.tasks.name],
      response: {
        200: taskSelectSchema.array(),
      },
    },
    handler: (request) => {
      return instance.tasksService.getAll(
        {
          userId: request.user.id,
        },
        [
          {
            column: "done",
            direction: "asc",
          },
          {
            column: "updatedAt",
            direction: "desc",
          },
        ]
      );
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "PUT",
    url: "/:id",
    schema: {
      tags: [SWAGGER_TAGS.tasks.name],
      params: taskSelectSchema.pick({ id: true }),
      body: taskUpdateSchema,
      response: {
        200: taskSelectSchema,
      },
    },
    handler: (request) => {
      return instance.tasksService.update(
        request.params.id,
        {
          userId: request.user.id,
        },
        {
          title: request.body.title,
          done: request.body.done,
        }
      );
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "DELETE",
    url: "/:id",
    schema: {
      tags: [SWAGGER_TAGS.tasks.name],
      params: taskSelectSchema.pick({ id: true }),
      response: {
        200: taskSelectSchema,
      },
    },
    handler: (request) => {
      return instance.tasksService.delete(request.params.id, {
        userId: request.user.id,
      });
    },
  });
};
