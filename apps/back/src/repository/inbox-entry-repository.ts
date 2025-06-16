import { dbClient } from "@/db/client.js";
import { inboxEntry } from "@/db/schema.js";
import { ValidationError } from "@/lib/errors/bad-request-error.js";
import { and, eq, type InferInsertModel } from "drizzle-orm";

export const getUserInboxEntries = (userId: number) => {
  return dbClient
    .select()
    .from(inboxEntry)
    .where(eq(inboxEntry.userId, userId));
};

export const getUserInboxEntryById = async (id: number, userId: number) => {
  const result = await dbClient
    .select()
    .from(inboxEntry)
    .where(and(eq(inboxEntry.id, id), eq(inboxEntry.userId, userId)));

  const entry = result[0];

  if (!entry) {
    throw new ValidationError("Entry not found");
  }

  return entry;
};

export const createUserInboxEntry = async (
  userId: number,
  data: { title: string }
) => {
  const result = await dbClient
    .insert(inboxEntry)
    .values({
      ...data,
      userId,
    })
    .returning();

  return result[0];
};

export const updateUserInboxEntry = async (
  id: number,
  userId: number,
  data: { title: string }
) => {
  const result = await dbClient
    .update(inboxEntry)
    .set(data)
    .where(and(eq(inboxEntry.id, id), eq(inboxEntry.userId, userId)))
    .returning();

  const entry = result[0];

  if (!entry) {
    throw new ValidationError("Entry not found");
  }

  return entry;
};

export const deleteUserInboxEntry = async (id: number, userId: number) => {
  const result = await dbClient
    .delete(inboxEntry)
    .where(and(eq(inboxEntry.id, id), eq(inboxEntry.userId, userId)))
    .returning();

  const entry = result[0];

  if (!entry) {
    throw new ValidationError("Entry not found");
  }

  return entry;
};
