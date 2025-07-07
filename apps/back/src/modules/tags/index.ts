import type { FastifyInstance } from "fastify";
import { TagsRepository } from "./repository.js";
import routes from "./routes.js";
import { TagsService } from "./service.js";

declare module "fastify" {
  interface FastifyInstance {
    tagsService: TagsService;
  }
}

export default async (instance: FastifyInstance) => {
  const repository = new TagsRepository(instance.db);
  const service = new TagsService(repository);

  instance.decorate("tagsService", service);
  instance.register(routes, { prefix: "/tags" });
};
