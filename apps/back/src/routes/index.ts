import type { FastifyInstance } from "fastify";
import userRoutes from "./user-routes.js";
import authRoutes from "./auth-routes.js";
import inboxEntryRoutes from "./inbox-entry-routes.js";

export default async (instance: FastifyInstance) => {
  instance.register(authRoutes, { prefix: "/auth" });
  instance.register(userRoutes, { prefix: "/users" });
  instance.register(inboxEntryRoutes, { prefix: "/inbox-entries" });
};
