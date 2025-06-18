import type { FastifyInstance } from "fastify";
import routes from "./routes.js";
import service from "./service.js";

declare module "fastify" {
  interface FastifyInstance {
    authService: ReturnType<typeof service>;
  }
}

export default async (instance: FastifyInstance) => {
  instance.decorate("authService", service(instance));
  instance.register(routes, { prefix: "/auth" });
};
