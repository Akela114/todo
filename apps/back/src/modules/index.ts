import type { FastifyInstance } from "fastify";
import auth from "./auth/index.js";
import inboxEntries, { inboxEntryTables } from "./inbox-entries/index.js";
import users, { userTables } from "./users/index.js";
import fastifyPlugin from "fastify-plugin";

export const tables = {
  ...inboxEntryTables,
  ...userTables,
};

export default (instance: FastifyInstance) => {
  instance.register(fastifyPlugin(auth));
  instance.register(fastifyPlugin(inboxEntries));
  instance.register(fastifyPlugin(users));
};
