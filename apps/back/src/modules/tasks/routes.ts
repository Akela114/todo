import { SWAGGER_TAGS } from "@/lib/constants/swagger-tags.js";
import {
  changeTaskStatusSchema,
  modifyTaskSchema,
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
      return instance.tasksService.getFilteredByDayWithPagination(
        request.user.id,
        request.query.startFrom,
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
        request.params.id,
        {
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
