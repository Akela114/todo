import { SWAGGER_TAGS } from "@/lib/constants/swagger-tags.js";
import { coreApiBasicResponseSchema } from "@packages/schemas/common";
import {
  changeTaskStatusSchema,
  createOrModifyTaskSchemaBack,
  paginatedTasks,
  paginatedTasksQueryParams,
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
      tags: [SWAGGER_TAGS.tasks.name],
      querystring: paginatedTasksQueryParams,
      response: {
        200: paginatedTasks,
      },
    },
    handler: (request) => {
      return instance.tasksService.getAllPaginated(
        {
          userId: request.user.id,
          date: request.query.startFrom,
          tagIds: request.query.tagIds,
        },
        {
          page: request.query.page,
          pageSize: request.query.pageSize,
        },
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
      body: createOrModifyTaskSchemaBack,
      response: {
        200: taskSchema,
      },
    },
    handler: (request) => {
      return instance.tasksService.update(
        {
          id: request.params.id,
          userId: request.user.id,
        },
        request.body,
      );
    },
  });

  instance.withTypeProvider<ZodTypeProvider>().route({
    withAuth: true,
    method: "PUT",
    url: "/:id/done",
    schema: {
      tags: [SWAGGER_TAGS.tasks.name],
      params: taskSchema.pick({ id: true }),
      body: changeTaskStatusSchema,
      response: {
        200: taskSchema,
      },
    },
    handler: (request) => {
      return instance.tasksService.changeStatus(
        {
          id: request.params.id,
          userId: request.user.id,
        },
        request.body.doneDate,
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
        200: coreApiBasicResponseSchema,
      },
    },
    handler: async (request) => {
      await instance.tasksService.delete({
        id: request.params.id,
        userId: request.user.id,
      });

      return { statusCode: 200, message: "OK" };
    },
  });
};
