import type { FastifyInstance } from "fastify";
import userService from "./user-service.js";
import fp from "fastify-plugin";
import authService from "./auth-service.js";

declare module "fastify" {
  interface FastifyInstance {
    userService: ReturnType<typeof userService>;
    authService: ReturnType<typeof authService>;
  }
}

export default fp((instance: FastifyInstance) => {
  instance.decorate("userService", userService(instance));
  instance.decorate("authService", authService(instance));
});
