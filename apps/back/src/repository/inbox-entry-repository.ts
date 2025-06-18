import { inboxEntry } from "@/db/schema.js";
import { ValidationError } from "@/lib/errors/bad-request-error.js";
import { and, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";

export default (instance: FastifyInstance) => {
  function getUserInboxEntries(userId: number) {
    return instance.db
      .select()
      .from(inboxEntry)
      .where(eq(inboxEntry.userId, userId));
  }

  async function getUserInboxEntryById(id: number, userId: number) {
    const result = await instance.db
      .select()
      .from(inboxEntry)
      .where(and(eq(inboxEntry.id, id), eq(inboxEntry.userId, userId)));

    const entry = result[0];

    if (!entry) {
      throw new ValidationError("Entry not found");
    }

    return entry;
  }

  async function createUserInboxEntry(userId: number, data: { title: string }) {
    const result = await instance.db
      .insert(inboxEntry)
      .values({
        ...data,
        userId,
      })
      .returning();

    return result[0];
  }

  async function updateUserInboxEntry(
    id: number,
    userId: number,
    data: { title: string }
  ) {
    const result = await instance.db
      .update(inboxEntry)
      .set(data)
      .where(and(eq(inboxEntry.id, id), eq(inboxEntry.userId, userId)))
      .returning();

    const entry = result[0];

    if (!entry) {
      throw new ValidationError("Entry not found");
    }

    return entry;
  }

  async function deleteUserInboxEntry(id: number, userId: number) {
    const result = await instance.db
      .delete(inboxEntry)
      .where(and(eq(inboxEntry.id, id), eq(inboxEntry.userId, userId)))
      .returning();

    const entry = result[0];

    if (!entry) {
      throw new ValidationError("Entry not found");
    }

    return entry;
  }

  return {
    getUserInboxEntries,
    getUserInboxEntryById,
    createUserInboxEntry,
    updateUserInboxEntry,
    deleteUserInboxEntry,
  };
};
