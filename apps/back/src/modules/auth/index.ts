import type { FastifyInstance } from "fastify";
import routes from "./routes.js";
import { AuthService } from "./service.js";

declare module "fastify" {
  interface FastifyInstance {
    authService: AuthService;
  }
}

export default async (instance: FastifyInstance) => {
  const service = new AuthService(instance);

  instance.decorate("authService", service);
  instance.register(routes, { prefix: "/auth" });
};
