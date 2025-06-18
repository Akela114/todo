import type { FastifyInstance } from "fastify";
import routes from "./routes.js";
import repository from "./repository.js";
export * as inboxEntryTables from "./tables.js";

declare module "fastify" {
  interface FastifyInstance {
    inboxEntryRepository: ReturnType<typeof repository>;
  }
}

export default async (instance: FastifyInstance) => {
  instance.decorate("inboxEntryRepository", repository(instance));
  instance.register(routes, { prefix: "/inbox-entries" });
};
