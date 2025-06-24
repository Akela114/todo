import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";
import { SWAGGER_TAGS } from "@/lib/constants/swagger-tags.js";
import { taskSchema, modifyTaskSchema } from "@packages/schemas/task";

export default async (instance: FastifyInstance) => {
  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "GET",
    url: "/",
    schema: {
      tags: [SWAGGER_TAGS.tasks.name],
      response: {
        200: taskSchema.array(),
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
            column: "priority",
            direction: "desc",
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
      params: taskSchema.pick({ id: true }),
      body: modifyTaskSchema,
      response: {
        200: taskSchema,
      },
    },
    handler: (request) => {
      return instance.tasksService.update(
        request.params.id,
        {
          userId: request.user.id,
        },
        request.body
      );
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "DELETE",
    url: "/:id",
    schema: {
      tags: [SWAGGER_TAGS.tasks.name],
      params: taskSchema.pick({ id: true }),
      response: {
        200: taskSchema,
      },
    },
    handler: (request) => {
      return instance.tasksService.delete(request.params.id, {
        userId: request.user.id,
      });
    },
  });
};
