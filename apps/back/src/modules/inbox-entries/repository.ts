import { inboxEntry } from "@/db/schema.js";
import { type Pagination, Repository, type Transaction } from "@/lib/types.js";
import type {
  CreateOrModifyInboxEntry,
  InboxEntry,
} from "@packages/schemas/inbox-entry";
import { and, count, desc, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type {
  GetAllFilterParams,
  PrimaryKeyFields,
  RequiredFields,
} from "./types.js";

export class InboxEntriesRepository extends Repository<
  InboxEntry,
  typeof inboxEntry,
  PrimaryKeyFields,
  RequiredFields,
  GetAllFilterParams,
  CreateOrModifyInboxEntry
> {
  constructor(protected client: NodePgDatabase<Record<string, unknown>>) {
    super(client);
  }

  async getFirst(
    filters: RequiredFields & { id?: number },
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx) => {
      const data = await this.getBaseQuery(tx)
        .where(
          and(
            eq(inboxEntry.userId, filters.userId),
            ...(filters.id ? [eq(inboxEntry.id, filters.id)] : []),
          ),
        )
        .limit(1)
        .execute();

      return this.transformBaseQueryResult(data)[0] ?? null;
    }, transaction);
  }

  async getAllPaginated(
    filters: GetAllFilterParams,
    pagination: Pagination,
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx: Transaction) => {
      const [totalCount, data] = await Promise.all([
        this.getAllTotalCount(filters, tx),
        this.withPagination(
          this.getAllQuery(filters, tx),
          pagination,
        ).execute(),
      ]);

      return {
        data: this.transformBaseQueryResult(data),
        pagination: {
          page: pagination.page,
          pageSize: pagination.pageSize,
          totalCount,
        },
      };
    }, transaction);
  }

  async getAllTotalCount(
    filters: GetAllFilterParams,
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx: Transaction) => {
      const [{ totalCount }] = await tx
        .select({ totalCount: count() })
        .from(inboxEntry)
        .where(eq(inboxEntry.userId, filters.userId));

      return totalCount;
    }, transaction);
  }

  async create(
    requiredFilters: RequiredFields,
    entryData: CreateOrModifyInboxEntry,
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx: Transaction) => {
      const [createdTask] = await tx
        .insert(inboxEntry)
        .values({ userId: requiredFilters.userId, ...entryData })
        .returning();

      return this.getFirst(
        { userId: createdTask.userId, id: createdTask.id },
        tx,
      );
    }, transaction);
  }

  async update(
    columnsToCheck: PrimaryKeyFields & RequiredFields,
    entryData: CreateOrModifyInboxEntry,
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx: Transaction) => {
      const [updatedEntry] = await tx
        .update(inboxEntry)
        .set(entryData)
        .where(
          and(
            eq(inboxEntry.userId, columnsToCheck.userId),
            eq(inboxEntry.id, columnsToCheck.id),
          ),
        )
        .returning();

      return this.getFirst(
        { userId: updatedEntry.userId, id: updatedEntry.id },
        tx,
      );
    }, transaction);
  }
  async delete(
    columnsToCheck: PrimaryKeyFields & RequiredFields,
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx: Transaction) => {
      return tx
        .delete(inboxEntry)
        .where(
          and(
            eq(inboxEntry.userId, columnsToCheck.userId),
            eq(inboxEntry.id, columnsToCheck.id),
          ),
        );
    }, transaction);
  }

  protected getAllQuery(
    filters: GetAllFilterParams,
    transaction?: Transaction,
  ) {
    const client = transaction ?? this.client;

    return this.getBaseQuery(client)
      .where(eq(inboxEntry.userId, filters.userId))
      .orderBy(desc(inboxEntry.updatedAt))
      .$dynamic();
  }

  protected getBaseQuery(transaction?: Transaction) {
    const client = transaction ?? this.client;

    return client.select().from(inboxEntry).$dynamic();
  }

  protected transformBaseQueryResult(
    result: Awaited<
      ReturnType<ReturnType<typeof this.getBaseQuery>["execute"]>
    >,
  ) {
    return result;
  }
}
