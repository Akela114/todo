import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import userRepository from "./user-repository.js";
import inboxEntryRepository from "./inbox-entry-repository.js";

declare module "fastify" {
  interface FastifyInstance {
    userRepository: ReturnType<typeof userRepository>;
    inboxEntryRepository: ReturnType<typeof inboxEntryRepository>;
  }
}

export default fp((instance: FastifyInstance) => {
  instance.decorate("inboxEntryRepository", inboxEntryRepository(instance));
  instance.decorate("userRepository", userRepository(instance));
});
