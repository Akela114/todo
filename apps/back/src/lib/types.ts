import type { PaginatedResponse } from "@packages/schemas/common";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type {
  PgQueryResultHKT,
  PgSelect,
  PgTable,
  PgTransaction,
} from "drizzle-orm/pg-core";

export type Pagination = { page: number; pageSize: number };
export type Transaction =
  | NodePgDatabase<Record<string, unknown>>
  | PgTransaction<PgQueryResultHKT, Record<string, unknown>>;

export abstract class Repository<
  DataToReturn,
  Table extends PgTable,
  PrimaryKeyFields extends Partial<InferSelectModel<Table>>,
  RequiredFields extends Partial<InferSelectModel<Table>>,
  GetAllFiltersParams extends RequiredFields,
  CreateOrUpdateData extends Partial<InferInsertModel<Table>>,
> {
  constructor(protected client: NodePgDatabase<Record<string, unknown>>) {}

  abstract getFirst<T>(
    filters: RequiredFields & T,
    transaction?: Transaction,
  ): Promise<DataToReturn | null>;

  async getAll(filters: GetAllFiltersParams, transaction?: Transaction) {
    return this.withTransaction(async (tx: Transaction) => {
      return this.transformBaseQueryResult(
        await this.getAllQuery(filters, tx).execute(),
      );
    }, transaction);
  }

  abstract getAllPaginated(
    filters: GetAllFiltersParams,
    pagination: Pagination,
    transaction?: Transaction,
  ): Promise<PaginatedResponse<DataToReturn>>;

  abstract getAllTotalCount(
    filters: GetAllFiltersParams,
    transaction?: Transaction,
  ): Promise<number>;

  abstract create(
    requiredFilters: RequiredFields,
    data: CreateOrUpdateData,
    transaction?: Transaction,
  ): Promise<DataToReturn>;

  abstract update(
    columnsToCheck: PrimaryKeyFields & RequiredFields,
    data: CreateOrUpdateData,
    transaction?: Transaction,
  ): Promise<DataToReturn>;

  abstract delete(
    columnsToCheck: PrimaryKeyFields & RequiredFields,
    transaction?: Transaction,
  ): Promise<unknown>;

  withTransaction<T>(
    callback: (tx: Transaction) => Promise<T>,
    transaction?: Transaction,
    createIfNotExists?: boolean,
  ) {
    const transactionToUse =
      transaction ?? (!createIfNotExists ? this.client : null);

    return transactionToUse
      ? callback(transactionToUse)
      : this.client.transaction(callback);
  }

  protected abstract getAllQuery(
    filters: GetAllFiltersParams,
    transaction?: Transaction,
  ): PgSelect;

  protected abstract getBaseQuery(transaction?: Transaction): PgSelect;

  protected abstract transformBaseQueryResult<T>(
    result: Awaited<
      ReturnType<ReturnType<typeof this.getBaseQuery>["execute"]>
    >,
  ): DataToReturn[];

  protected withPagination<T extends PgSelect>(qb: T, pagination: Pagination) {
    return qb
      .limit(pagination.pageSize)
      .offset((pagination.page - 1) * pagination.pageSize);
  }
}

export abstract class Service<
  // biome-ignore lint/suspicious/noExplicitAny: don't want to pass all the types
  Repo extends Repository<any, any, any, any, any, any>,
> {
  constructor(protected repository: Repo) {}

  async getFirst(...[filters, tx]: Parameters<Repo["getFirst"]>) {
    return this.repository.getFirst(filters, tx);
  }

  async getAll(...[filters, tx]: Parameters<Repo["getAll"]>) {
    return this.repository.getAll(filters, tx);
  }

  async getAllPaginated(
    ...[filters, pagination, tx]: Parameters<Repo["getAllPaginated"]>
  ) {
    return this.repository.getAllPaginated(filters, pagination, tx);
  }

  async create(...[requiredFilters, data, tx]: Parameters<Repo["create"]>) {
    return this.repository.create(requiredFilters, data, tx);
  }

  async update(...[columnsToCheck, data, tx]: Parameters<Repo["update"]>) {
    return this.repository.update(columnsToCheck, data, tx);
  }

  async delete(...[columnsToCheck, tx]: Parameters<Repo["delete"]>) {
    return this.repository.delete(columnsToCheck, tx);
  }
}
