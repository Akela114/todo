import { dbClient } from "@/db/client.js";
import { user } from "@/db/schema.js";
import { eq, type InferInsertModel } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
  const result = await dbClient
    .select()
    .from(user)
    .where(eq(user.email, email));
  return result[0];
};

export const getUserByUsername = async (username: string) => {
  const result = await dbClient
    .select()
    .from(user)
    .where(eq(user.username, username));
  return result[0];
};

export const createUser = async (data: InferInsertModel<typeof user>) => {
  const result = await dbClient.insert(user).values(data).returning();
  return result[0];
};
