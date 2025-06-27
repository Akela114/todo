import { task } from "@/db/schema.js";
import { BaseRepository } from "@/lib/base-classes/base-repository.js";
import { and, asc, count, desc, eq, isNull, lte, or } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgQueryResultHKT, PgTransaction } from "drizzle-orm/pg-core";

export class TasksRepository extends BaseRepository<
  typeof task,
  "id",
  "userId"
> {
  constructor(protected client: NodePgDatabase<Record<string, unknown>>) {
    super(client, task, "id", ["userId"]);
  }

  async getFilteredByDayWithPagination(
    userId: number,
    date: string,
    pagination: { page: number; pageSize: number },
    transaction?: PgTransaction<PgQueryResultHKT, Record<string, unknown>>,
  ) {
    const client = transaction ?? this.client;

    const [data, [{ totalCount }]] = await Promise.all([
      client
        .select()
        .from(this.table)
        .where(
          and(
            eq(this.table.userId, userId),
            or(
              and(lte(this.table.startDate, date), isNull(this.table.doneDate)),
              eq(this.table.doneDate, date),
            ),
          ),
        )
        .orderBy(
          desc(this.table.doneDate),
          desc(this.table.priority),
          asc(this.table.endDate),
          desc(this.table.updatedAt),
        )
        .offset((pagination.page - 1) * pagination.pageSize)
        .limit(pagination.pageSize),
      client
        .select({ totalCount: count() })
        .from(this.table)
        .where(
          and(
            eq(this.table.userId, userId),
            or(
              and(lte(this.table.startDate, date), isNull(this.table.doneDate)),
              eq(this.table.doneDate, date),
            ),
          ),
        ),
    ]);

    return {
      data,
      pagination: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalCount,
      },
    };
  }
}
