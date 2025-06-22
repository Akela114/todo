import type { FastifyInstance } from "fastify";
import { TasksRepository } from "./repository.js";
import { TasksService } from "./service.js";
import routes from "./routes.js";

declare module "fastify" {
  interface FastifyInstance {
    tasksService: TasksService;
  }
}

export default async (instance: FastifyInstance) => {
  const repository = new TasksRepository(instance.db);
  const service = new TasksService(repository);

  instance.decorate("tasksService", service);
  instance.register(routes, { prefix: "/tasks" });
};
