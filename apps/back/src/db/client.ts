import { drizzle } from "drizzle-orm/node-postgres";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    db: ReturnType<typeof drizzle>;
  }
}

// biome-ignore lint/style/noNonNullAssertion: should always be provided
export const dbClient = drizzle(process.env.DB_URL!);

export default fp((instance, _options, done) => {
  instance.decorate("db", dbClient);
  done();
});
