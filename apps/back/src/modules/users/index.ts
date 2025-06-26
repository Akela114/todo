import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { UsersRepository } from "./repository.js";
import routes from "./routes.js";
import { UsersService } from "./service.js";

declare module "fastify" {
  interface FastifyInstance {
    usersService: UsersService;
  }
}

export default fastifyPlugin(async (instance: FastifyInstance) => {
  const repository = new UsersRepository(instance.db);
  const service = new UsersService(repository);

  instance.decorate("usersService", service);
  instance.register(routes, { prefix: "/users" });
});
