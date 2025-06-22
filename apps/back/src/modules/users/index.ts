import type { FastifyInstance } from "fastify";
import routes from "./routes.js";
import fastifyPlugin from "fastify-plugin";
import { UsersService } from "./service.js";
import { UsersRepository } from "./repository.js";

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
