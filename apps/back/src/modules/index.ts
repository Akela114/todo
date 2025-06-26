import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";

import auth from "./auth/index.js";
import inboxEntries from "./inbox-entries/index.js";
import tasks from "./tasks/index.js";
import users from "./users/index.js";

export default (instance: FastifyInstance) => {
  instance.register(fastifyPlugin(auth));
  instance.register(fastifyPlugin(inboxEntries));
  instance.register(fastifyPlugin(users));
  instance.register(fastifyPlugin(tasks));
};
