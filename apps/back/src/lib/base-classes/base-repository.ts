import { type InferSelectModel, and, asc, count, desc, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type {
  PgColumn,
  PgInsertValue,
  PgQueryResultHKT,
  PgTable,
  PgTransaction,
  PgUpdateSetSource,
} from "drizzle-orm/pg-core";

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

  getAll(
    columnsToCheckAlwaysValues: Record<K, unknown>,
    orders?: {
      column: keyof InferSelectModel<T>;
      direction: "asc" | "desc";
    }[],
    transaction?: PgTransaction<PgQueryResultHKT, Record<string, unknown>>,
  ) {
    const client = transaction ?? this.client;

    const query = client
      .select()
      // TODO: https://github.com/drizzle-team/drizzle-orm/discussions/4318
      // @ts-ignore drizzle-bug
      .from(this.table)
      .where(
        and(
          ...this.columnsToCheckAlwaysNames.map((name) =>
            eq(this.table[name], columnsToCheckAlwaysValues[name]),
          ),
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

  async getAllCount(
    columnsToCheckAlwaysValues: Record<K, unknown>,
    transaction?: PgTransaction<PgQueryResultHKT, Record<string, unknown>>,
  ) {
    const client = transaction ?? this.client;

    const result = await client
      .select({ count: count() })
      // TODO: https://github.com/drizzle-team/drizzle-orm/discussions/4318
      // @ts-ignore drizzle-bug
      .from(this.table)
      .where(
        and(
          ...this.columnsToCheckAlwaysNames.map((name) =>
            eq(this.table[name], columnsToCheckAlwaysValues[name]),
          ),
        ),
      );

    return result[0].count;
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
}
