import type { inboxEntry } from "@/db/schema.js";
import { BaseService } from "@/lib/base-classes/base-service.js";
import type { InboxEntriesRepository } from "./repository.js";
import type { FastifyInstance } from "fastify";
import { NotFoundError } from "@/lib/errors/not-found-error.js";

export class InboxEntriesService extends BaseService<
  typeof inboxEntry,
  "id",
  "userId"
> {
  constructor(
    private instance: FastifyInstance,
    protected repository: InboxEntriesRepository
  ) {
    super(repository, "Inbox entry");
  }

  async convertInboxEntryToTask({
    id,
    userId,
    title,
    priority,
  }: {
    id: number;
    userId: number;
    title: string;
    priority: number;
  }) {
    return await this.instance.db.transaction(async (tx) => {
      const inboxEntry = await this.delete(id, { userId }, tx);

      if (!inboxEntry) {
        throw new NotFoundError(`${this.entityName} not found`);
      }

      const task = await this.instance.tasksService.create({
        userId,
        title,
        priority,
      });

      return task;
    });
  }
}
