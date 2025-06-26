import { inboxEntry } from "@/db/schema.js";
import { BaseRepository } from "@/lib/base-classes/base-repository.js";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export class InboxEntriesRepository extends BaseRepository<
  typeof inboxEntry,
  "id",
  "userId"
> {
  constructor(protected client: NodePgDatabase<Record<string, unknown>>) {
    super(client, inboxEntry, "id", ["userId"]);
  }

  async getAllPaginated(
    args: Parameters<InboxEntriesRepository["getAll"]>,
    pagination: { page: number; pageSize: number },
  ) {
    const getAllQuery = this.getAll(...args);

    const [entries, totalCount] = await Promise.all([
      getAllQuery
        .offset((pagination.page - 1) * pagination.pageSize)
        .limit(pagination.pageSize),
      this.getAllCount(args[0], args[2]),
    ]);

    return {
      data: entries,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalCount,
      },
    };
  }
}
