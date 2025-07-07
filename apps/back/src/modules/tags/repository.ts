import { tag, task, taskTag } from "@/db/schema.js";
import { type Pagination, Repository, type Transaction } from "@/lib/types.js";
import type { CreateOrModifyTag, Tag } from "@packages/schemas/tag";
import {
  and,
  count,
  eq,
  exists,
  ilike,
  inArray,
  isNull,
  lte,
  or,
  sql,
} from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { alias } from "drizzle-orm/pg-core";
import type {
  GetAllFilterParams,
  PrimaryKeyFields,
  RequiredFields,
} from "./types.js";

export class TagsRepository extends Repository<
  Tag,
  typeof tag,
  PrimaryKeyFields,
  RequiredFields,
  GetAllFilterParams,
  CreateOrModifyTag
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
            eq(tag.userId, filters.userId),
            ...(filters.id ? [eq(tag.id, filters.id)] : []),
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
      const otherTaskTag = alias(taskTag, "otherTaskTag");
      const [{ totalCount }] = await tx
        .select({ totalCount: count() })
        .from(tag)
        .where(
          and(
            eq(tag.userId, filters.userId),
            ...(filters.query ? [ilike(tag.name, `%${filters.query}%`)] : []),
            ...(filters?.activeTagIds
              ? [
                  or(
                    inArray(tag.id, filters.activeTagIds),
                    exists(
                      tx
                        .select({
                          tagId: taskTag.tagId,
                        })
                        .from(taskTag)
                        .leftJoin(
                          otherTaskTag,
                          eq(taskTag.taskId, otherTaskTag.taskId),
                        )
                        .leftJoin(task, eq(task.id, taskTag.taskId))
                        .where(
                          and(
                            eq(taskTag.tagId, tag.id),
                            inArray(otherTaskTag.tagId, filters.activeTagIds),
                            ...(filters.startFrom
                              ? [
                                  or(
                                    and(
                                      lte(task.startDate, filters.startFrom),
                                      isNull(task.doneDate),
                                    ),
                                    eq(task.doneDate, filters.startFrom),
                                  ),
                                ]
                              : []),
                          ),
                        )
                        .groupBy(taskTag.tagId)
                        .having(
                          sql`COUNT(DISTINCT ${otherTaskTag.tagId}) = ${filters.activeTagIds.length}`,
                        ),
                    ),
                  ),
                ]
              : filters?.startFrom
                ? [
                    exists(
                      tx
                        .select()
                        .from(taskTag)
                        .leftJoin(task, eq(task.id, taskTag.taskId))
                        .where(
                          and(
                            eq(taskTag.tagId, tag.id),
                            or(
                              and(
                                lte(task.startDate, filters.startFrom),
                                isNull(task.doneDate),
                              ),
                              eq(task.doneDate, filters.startFrom),
                            ),
                          ),
                        ),
                    ),
                  ]
                : []),
          ),
        );

      return totalCount;
    }, transaction);
  }

  async create(
    requiredFilters: RequiredFields,
    tagData: CreateOrModifyTag,
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx: Transaction) => {
      const [createdTag] = await tx
        .insert(tag)
        .values({ userId: requiredFilters.userId, ...tagData })
        .returning();

      return this.getFirst(
        { userId: createdTag.userId, id: createdTag.id },
        tx,
      );
    }, transaction);
  }

  async update(
    columnsToCheck: PrimaryKeyFields & RequiredFields,
    tagData: CreateOrModifyTag,
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx: Transaction) => {
      const [updatedTag] = await tx
        .update(tag)
        .set(tagData)
        .where(
          and(
            eq(tag.userId, columnsToCheck.userId),
            eq(tag.id, columnsToCheck.id),
          ),
        )
        .returning();

      return this.getFirst(
        { userId: updatedTag.userId, id: updatedTag.id },
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
        .delete(tag)
        .where(
          and(
            eq(tag.userId, columnsToCheck.userId),
            eq(tag.id, columnsToCheck.id),
          ),
        );
    }, transaction);
  }

  protected getAllQuery(
    filters: GetAllFilterParams,
    transaction?: Transaction,
  ) {
    const client = transaction ?? this.client;

    const otherTaskTag = alias(taskTag, "otherTaskTag");
    return client
      .select({
        tag,
        tasksCount: filters.startFrom
          ? sql<number>`CAST(
            COUNT(${taskTag.tagId}) FILTER (
              WHERE (${task.startDate} <= ${filters.startFrom} AND ${task.doneDate} IS NULL) OR (${task.doneDate} = ${filters.startFrom})
            ) AS INTEGER) 
          `.as("tasksCount")
          : count(taskTag.tagId).as("tasksCount"),
      })
      .from(tag)
      .where(
        and(
          eq(tag.userId, filters.userId),
          ...(filters.query ? [ilike(tag.name, `%${filters.query}%`)] : []),
          ...(filters?.activeTagIds
            ? [
                or(
                  inArray(tag.id, filters.activeTagIds),
                  exists(
                    client
                      .select({
                        tagId: taskTag.tagId,
                      })
                      .from(taskTag)
                      .leftJoin(
                        otherTaskTag,
                        eq(taskTag.taskId, otherTaskTag.taskId),
                      )
                      .leftJoin(task, eq(task.id, taskTag.taskId))
                      .where(
                        and(
                          eq(taskTag.tagId, tag.id),
                          inArray(otherTaskTag.tagId, filters.activeTagIds),
                          ...(filters.startFrom
                            ? [
                                or(
                                  and(
                                    lte(task.startDate, filters.startFrom),
                                    isNull(task.doneDate),
                                  ),
                                  eq(task.doneDate, filters.startFrom),
                                ),
                              ]
                            : []),
                        ),
                      )
                      .groupBy(taskTag.tagId)
                      .having(
                        sql`COUNT(DISTINCT ${otherTaskTag.tagId}) = ${filters.activeTagIds.length}`,
                      ),
                  ),
                ),
              ]
            : filters?.startFrom
              ? [
                  exists(
                    client
                      .select()
                      .from(taskTag)
                      .leftJoin(task, eq(task.id, taskTag.taskId))
                      .where(
                        and(
                          eq(taskTag.tagId, tag.id),
                          or(
                            and(
                              lte(task.startDate, filters.startFrom),
                              isNull(task.doneDate),
                            ),
                            eq(task.doneDate, filters.startFrom),
                          ),
                        ),
                      ),
                  ),
                ]
              : []),
        ),
      )
      .leftJoin(taskTag, eq(tag.id, taskTag.tagId))
      .leftJoin(task, eq(task.id, taskTag.taskId))
      .groupBy(tag.id)
      .$dynamic();
  }

  protected getBaseQuery(transaction?: Transaction) {
    const client = transaction ?? this.client;

    return client
      .select({
        tag,
        tasksCount: count(taskTag.taskId),
      })
      .from(tag)
      .leftJoin(taskTag, eq(tag.id, taskTag.tagId))
      .groupBy(tag.id)
      .$dynamic();
  }

  protected transformBaseQueryResult(
    result: Awaited<
      ReturnType<ReturnType<typeof this.getBaseQuery>["execute"]>
    >,
  ) {
    return result.map(({ tag, tasksCount }) => ({
      ...tag,
      tasksCount,
    }));
  }
}
