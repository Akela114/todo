import { eq, type InferInsertModel } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { user } from "./tables.js";

export default (instance: FastifyInstance) => {
  async function getUserByEmail(email: string) {
    const result = await instance.db
      .select()
      .from(user)
      .where(eq(user.email, email));
    return result[0];
  }

  async function getUserByUsername(username: string) {
    const result = await instance.db
      .select()
      .from(user)
      .where(eq(user.username, username));
    return result[0];
  }

  async function createUser(data: InferInsertModel<typeof user>) {
    const result = await instance.db.insert(user).values(data).returning();
    return result[0];
  }

  return {
    getUserByEmail,
    getUserByUsername,
    createUser,
  };
};
