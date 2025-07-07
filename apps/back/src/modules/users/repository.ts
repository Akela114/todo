import { user } from "@/db/schema.js";
import { type Pagination, Repository, type Transaction } from "@/lib/types.js";
import type { User } from "@packages/schemas/user";
import { and, count, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type {
  CreateOrModifyUserRepository,
  GetAllFilterParams,
  PrimaryKeyFields,
  RequiredFields,
} from "./types.js";

export class UsersRepository extends Repository<
  User,
  typeof user,
  PrimaryKeyFields,
  RequiredFields,
  GetAllFilterParams,
  CreateOrModifyUserRepository
> {
  constructor(protected client: NodePgDatabase<Record<string, unknown>>) {
    super(client);
  }

  async getFirst(
    filters: RequiredFields & {
      id?: number;
      email?: string;
      username?: string;
    },
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx) => {
      const data = await this.getBaseQuery(tx)
        .where(
          and(
            ...(filters.id ? [eq(user.id, filters.id)] : []),
            ...(filters.email ? [eq(user.email, filters.email)] : []),
            ...(filters.username ? [eq(user.username, filters.username)] : []),
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
    _filters: GetAllFilterParams,
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx: Transaction) => {
      const [{ totalCount }] = await tx
        .select({ totalCount: count() })
        .from(user);

      return totalCount;
    }, transaction);
  }

  async create(
    _requiredFilters: RequiredFields,
    userData: CreateOrModifyUserRepository,
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx: Transaction) => {
      const [createdUser] = await tx.insert(user).values(userData).returning();

      return createdUser;
    }, transaction);
  }

  async update(
    columnsToCheck: PrimaryKeyFields & RequiredFields,
    userData: CreateOrModifyUserRepository,
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx: Transaction) => {
      const [updatedUser] = await tx
        .update(user)
        .set(userData)
        .where(eq(user.id, columnsToCheck.id))
        .returning();

      return updatedUser;
    }, transaction);
  }
  async delete(
    columnsToCheck: PrimaryKeyFields & RequiredFields,
    transaction?: Transaction,
  ) {
    return this.withTransaction(async (tx: Transaction) => {
      return tx.delete(user).where(eq(user.id, columnsToCheck.id));
    }, transaction);
  }

  protected getAllQuery(
    _filters: GetAllFilterParams,
    transaction?: Transaction,
  ) {
    const client = transaction ?? this.client;

    return this.getBaseQuery(client).$dynamic();
  }

  protected getBaseQuery(transaction?: Transaction) {
    const client = transaction ?? this.client;

    return client.select().from(user).$dynamic();
  }

  protected transformBaseQueryResult(
    result: Awaited<
      ReturnType<ReturnType<typeof this.getBaseQuery>["execute"]>
    >,
  ) {
    return result;
  }
}
