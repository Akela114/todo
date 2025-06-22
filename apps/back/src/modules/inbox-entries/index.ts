import type { FastifyInstance } from "fastify";
import routes from "./routes.js";
import { InboxEntriesRepository } from "./repository.js";
import { InboxEntriesService } from "./service.js";

declare module "fastify" {
  interface FastifyInstance {
    inboxEntryService: InboxEntriesService;
  }
}

export default async (instance: FastifyInstance) => {
  const repository = new InboxEntriesRepository(instance.db);
  const service = new InboxEntriesService(instance, repository);

  instance.decorate("inboxEntryService", service);
  instance.register(routes, { prefix: "/inbox-entries" });
};
