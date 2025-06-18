import type { FastifyInstance } from "fastify";
import routes from "./routes.js";
import repository from "./repository.js";
import service from "./service.js";
import fastifyPlugin from "fastify-plugin";
export * as userTables from "./tables.js";

declare module "fastify" {
  interface FastifyInstance {
    userRepository: ReturnType<typeof repository>;
    userService: ReturnType<typeof service>;
  }
}

export default fastifyPlugin(async (instance: FastifyInstance) => {
  instance.decorate("userRepository", repository(instance));
  instance.decorate("userService", service(instance));
  instance.register(routes, { prefix: "/users" });
});
