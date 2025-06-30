import type { FastifyInstance } from "fastify";
import { InboxEntriesRepository } from "./repository.js";
import routes from "./routes.js";
import { InboxEntriesService } from "./service.js";

declare module "fastify" {
  interface FastifyInstance {
    inboxEntryService: InboxEntriesService;
  }
}

export default async (instance: FastifyInstance) => {
  const repository = new InboxEntriesRepository(instance.db);
  const service = new InboxEntriesService(repository);

  instance.decorate("inboxEntryService", service);
  instance.register(routes, { prefix: "/inbox-entries" });
};
