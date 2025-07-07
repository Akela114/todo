import { tag, task, taskTag } from "@/db/schema.js";
import { type Pagination, Repository, type Transaction } from "@/lib/types.js";
import type { CreateOrModifyTaskBack, Task } from "@packages/schemas/task";
import {
  and,
  asc,
  count,
  desc,
  eq,
  inArray,
  isNull,
  lte,
  notInArray,
  or,
  sql,
} from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type {
  GetAllFilterParams,
  PrimaryKeyFields,
  RequiredFields,
} from "./types.js";

export class TasksRepository extends Repository<
  Task,
  typeof task,
  PrimaryKeyFields,
  RequiredFields,
  GetAllFilterParams,
  CreateOrModifyTaskBack
> {
  constructor(protected client: NodePgDatabase<Record<string, unknown>>) {
    super(client);
  }

  async getFirst(
    filters: RequiredFields & { id?: number; parentTaskId?: number },
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx) => {
      const data = await this.getBaseQuery(tx)
        .where(
          and(
            eq(task.userId, filters.userId),
            ...(filters.id ? [eq(task.id, filters.id)] : []),
            ...(filters.parentTaskId
              ? [eq(task.parentTaskId, filters.parentTaskId)]
              : []),
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
    return this.withTransaction(async (tx) => {
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
    return this.withTransaction(async (tx) => {
      const [{ totalCount }] = await tx
        .select({ totalCount: count() })
        .from(task)
        .where(
          and(
            eq(task.userId, filters.userId),
            or(
              and(lte(task.startDate, filters.date), isNull(task.doneDate)),
              eq(task.doneDate, filters.date),
            ),
          ),
        );

      return totalCount;
    }, transaction);
  }

  async create(
    requiredFilters: RequiredFields,
    { tagIds, ...taskData }: CreateOrModifyTaskBack & { parentTaskId?: number },
    transaction?: Transaction,
  ) {
    return this.withTransaction(
      async (tx) => {
        const [createdTask] = await tx
          .insert(task)
          .values({
            ...taskData,
            userId: requiredFilters.userId,
          })
          .returning();

        if (tagIds.length) {
          await tx.insert(taskTag).values(
            tagIds.map((tagId) => ({
              taskId: createdTask.id,
              tagId,
            })),
          );
        }

        return this.getFirst(
          { userId: createdTask.userId, id: createdTask.id },
          tx,
        );
      },
      transaction,
      true,
    );
  }

  async update(
    columnsToCheck: PrimaryKeyFields & RequiredFields,
    { tagIds, ...taskData }: CreateOrModifyTaskBack,
    transaction?: Transaction,
  ) {
    return this.withTransaction(
      async (tx) => {
        await tx
          .delete(taskTag)
          .where(
            and(
              eq(taskTag.taskId, columnsToCheck.id),
              notInArray(taskTag.tagId, tagIds),
            ),
          );

        if (tagIds.length) {
          await tx
            .insert(taskTag)
            .values(
              tagIds.map((tagId) => ({
                taskId: columnsToCheck.id,
                tagId,
              })),
            )
            .onConflictDoNothing();
        }

        const [updatedTask] = await tx
          .update(task)
          .set(taskData)
          .where(
            and(
              eq(task.userId, columnsToCheck.userId),
              eq(task.id, columnsToCheck.id),
            ),
          )
          .returning();

        return this.getFirst(
          { userId: updatedTask.userId, id: updatedTask.id },
          tx,
        );
      },
      transaction,
      true,
    );
  }

  async updateDoneDate(
    columnsToCheck: PrimaryKeyFields & RequiredFields,
    data: { doneDate: string | null },
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx) => {
      const [updatedTask] = await tx
        .update(task)
        .set(data)
        .where(
          and(
            eq(task.userId, columnsToCheck.userId),
            eq(task.id, columnsToCheck.id),
          ),
        )
        .returning();

      return this.getFirst(
        { userId: updatedTask.userId, id: updatedTask.id },
        tx,
      );
    }, transaction);
  }

  async delete(
    columnsToCheck: PrimaryKeyFields & RequiredFields,
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx) => {
      return tx
        .delete(task)
        .where(
          and(
            eq(task.userId, columnsToCheck.userId),
            eq(task.id, columnsToCheck.id),
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
      .where(
        and(
          eq(task.userId, filters.userId),
          or(
            and(lte(task.startDate, filters.date), isNull(task.doneDate)),
            eq(task.doneDate, filters.date),
          ),
          ...(filters?.tagIds ? [inArray(taskTag.tagId, filters.tagIds)] : []),
        ),
      )
      .orderBy(
        desc(task.doneDate),
        desc(task.priority),
        asc(task.endDate),
        desc(task.updatedAt),
      )
      .$dynamic();
  }

  protected getBaseQuery(transaction?: Transaction) {
    const client = transaction ?? this.client;

    return client
      .select({
        task,
        tags: sql<
          {
            id: number;
            name: string;
          }[]
        >`coalesce(json_agg(json_build_object('id', ${tag.id}, 'name', ${tag.name})) filter (where ${tag.id} is not null), '[]')`,
      })
      .from(task)
      .leftJoin(taskTag, eq(taskTag.taskId, task.id))
      .leftJoin(tag, eq(tag.id, taskTag.tagId))
      .groupBy(task.id)
      .$dynamic();
  }

  protected transformBaseQueryResult(
    result: Awaited<
      ReturnType<ReturnType<typeof this.getBaseQuery>["execute"]>
    >,
  ) {
    const transformedResult = result.map(({ task, tags }) => ({
      ...task,
      tags,
    }));

    return transformedResult;
  }
}
