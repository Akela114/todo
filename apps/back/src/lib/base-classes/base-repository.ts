import {
  type BinaryOperator,
  type InferSelectModel,
  and,
  asc,
  count,
  desc,
  eq,
  lte,
} from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type {
  PgColumn,
  PgInsertValue,
  PgQueryResultHKT,
  PgTable,
  PgTransaction,
  PgUpdateSetSource,
} from "drizzle-orm/pg-core";

type ColumnOpertaion = "eq" | "lte";
type ColumnValue = number | string | boolean | null;

type ColumnValueWithOpertaion = {
  value: ColumnValue;
  opertaion: ColumnOpertaion;
};

interface GetFewBaseOptions<
  T extends PgTable & Record<K | PK, PgColumn>,
  PK extends keyof InferSelectModel<T>,
  K extends keyof InferSelectModel<T> = never,
> {
  columnsToCheck: Record<K, ColumnValue | ColumnValueWithOpertaion> &
    Partial<
      Record<keyof InferSelectModel<T>, ColumnValue | ColumnValueWithOpertaion>
    >;
  orders?: {
    column: keyof InferSelectModel<T>;
    direction: "asc" | "desc";
  }[];
  transaction?: PgTransaction<PgQueryResultHKT, Record<string, unknown>>;
}

const columnOperationsMap: Record<ColumnOpertaion, BinaryOperator> = {
  eq,
  lte,
};

export class BaseRepository<
  T extends PgTable & Record<K | PK, PgColumn>,
  PK extends keyof InferSelectModel<T>,
  K extends keyof InferSelectModel<T> = never,
> {
  constructor(
    protected client: NodePgDatabase<Record<string, unknown>>,
    protected table: T,
    protected pKColumnName: PK,
    protected columnsToCheckAlwaysNames: K[] = [],
  ) {}

  async getFew(options: GetFewBaseOptions<T, PK, K>) {
    return this.generateGetFewBaseQuery(options);
  }

  async getFewWithPagination({
    pagination,
    ...options
  }: GetFewBaseOptions<T, PK, K> & {
    pagination: {
      page: number;
      pageSize: number;
    };
  }) {
    const baseQuery = this.generateGetFewBaseQuery(options);

    const [entries, totalCount] = await Promise.all([
      baseQuery
        .offset((pagination.page - 1) * pagination.pageSize)
        .limit(pagination.pageSize),
      this.getFewCount(options),
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

  async getOne(
    pKColumnValue: unknown,
    columnsToCheckAlwaysValues: Record<K, unknown>,
    transaction?: PgTransaction<PgQueryResultHKT, Record<string, unknown>>,
  ) {
    const client = transaction ?? this.client;

    const result = await client
      .select()
      // TODO: https://github.com/drizzle-team/drizzle-orm/discussions/4318
      // @ts-ignore drizzle-bug
      .from(this.table)
      .where(
        and(
          eq(this.table[this.pKColumnName], pKColumnValue),
          ...this.columnsToCheckAlwaysNames.map((name) =>
            eq(this.table[name], columnsToCheckAlwaysValues[name]),
          ),
        ),
      );

    return result[0] ?? null;
  }

  async create(
    data: PgInsertValue<T>,
    transaction?: PgTransaction<PgQueryResultHKT, Record<string, unknown>>,
  ) {
    const client = transaction ?? this.client;

    const result = await client.insert(this.table).values(data).returning();

    return (result as InferSelectModel<T>[])[0];
  }

  async update(
    pKColumnValue: unknown,
    columnsToCheckAlwaysValues: Record<K, unknown>,
    data: PgUpdateSetSource<T>,
    transaction?: PgTransaction<PgQueryResultHKT, Record<string, unknown>>,
  ) {
    const client = transaction ?? this.client;

    const result = await client
      .update(this.table)
      .set(data)
      .where(
        and(
          eq(this.table[this.pKColumnName], pKColumnValue),
          ...this.columnsToCheckAlwaysNames.map((name) =>
            eq(this.table[name], columnsToCheckAlwaysValues[name]),
          ),
        ),
      )
      .returning();

    return (result as InferSelectModel<T>[])[0];
  }

  async delete(
    pKColumnValue: unknown,
    columnsToCheckAlwaysValues: Record<K, unknown>,
    transaction?: PgTransaction<PgQueryResultHKT, Record<string, unknown>>,
  ) {
    const client = transaction ?? this.client;

    const result = await client
      .delete(this.table)
      .where(
        and(
          eq(this.table[this.pKColumnName], pKColumnValue),
          ...this.columnsToCheckAlwaysNames.map((name) =>
            eq(this.table[name], columnsToCheckAlwaysValues[name]),
          ),
        ),
      )
      .returning();

    return (result as InferSelectModel<T>[])[0];
  }

  private generateGetFewBaseQuery({
    columnsToCheck,
    orders,
    transaction,
  }: GetFewBaseOptions<T, PK, K>) {
    const client = transaction ?? this.client;

    const query = client
      .select()
      // TODO: https://github.com/drizzle-team/drizzle-orm/discussions/4318
      // @ts-ignore drizzle-bug
      .from(this.table)
      .where(
        and(
          ...Object.entries(columnsToCheck).map(([name, value]) => {
            if (value && typeof value === "object") {
              return columnOperationsMap[value.opertaion](
                this.table[name as K | keyof InferSelectModel<T>],
                value.value,
              );
            }
            return eq(this.table[name as K | keyof InferSelectModel<T>], value);
          }),
        ),
      );

    if (orders?.length) {
      query.orderBy(
        ...orders.map(({ column, direction }) => {
          return direction === "asc"
            ? asc(this.table[column])
            : desc(this.table[column]);
        }),
      );
    }

    return query;
  }

  private async getFewCount({
    columnsToCheck,
    transaction,
  }: GetFewBaseOptions<T, PK, K>) {
    const client = transaction ?? this.client;

    const query = client
      .select({ count: count() })
      // TODO: https://github.com/drizzle-team/drizzle-orm/discussions/4318
      // @ts-ignore drizzle-bug
      .from(this.table)
      .where(
        and(
          ...Object.entries(columnsToCheck).map(([name, value]) => {
            if (value && typeof value === "object") {
              return columnOperationsMap[value.opertaion](
                this.table[name as K | keyof InferSelectModel<T>],
                value.value,
              );
            }
            return eq(this.table[name as K | keyof InferSelectModel<T>], value);
          }),
        ),
      );

    const result = await query;

    return result[0].count;
  }
}
