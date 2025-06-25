import type { AnyPgColumn, AnyPgTable } from "drizzle-orm/pg-core";
import type { BaseRepository } from "./base-repository.js";
import { NotFoundError } from "../errors/not-found-error.js";
import type { InferSelectModel } from "drizzle-orm";

export class BaseService<
  T extends AnyPgTable & Record<K | PK, AnyPgColumn>,
  PK extends keyof InferSelectModel<T>,
  K extends keyof InferSelectModel<T> = never
> {
  constructor(
    protected repository: BaseRepository<T, PK, K>,
    protected entityName: string
  ) {}

  async getFew(...args: Parameters<BaseRepository<T, PK, K>["getFew"]>) {
    return this.repository.getFew(...args);
  }

  async getFewWithPagination(
    ...args: Parameters<BaseRepository<T, PK, K>["getFewWithPagination"]>
  ) {
    return this.repository.getFewWithPagination(...args);
  }

  async getAllPaginated(
    ...args: Parameters<BaseRepository<T, PK, K>["getFewWithPagination"]>
  ) {
    return this.repository.getFewWithPagination(...args);
  }

  async getOne(...args: Parameters<BaseRepository<T, PK, K>["getOne"]>) {
    const result = await this.repository.getOne(...args);

    if (!result) throw new NotFoundError(`${this.entityName} not found`);

    return result;
  }

  async create(...args: Parameters<BaseRepository<T, PK, K>["create"]>) {
    return this.repository.create(...args);
  }

  async update(...args: Parameters<BaseRepository<T, PK, K>["update"]>) {
    const result = await this.repository.update(...args);

    if (!result) throw new NotFoundError(`${this.entityName} not found`);

    return result;
  }

  async delete(...args: Parameters<BaseRepository<T, PK, K>["delete"]>) {
    const result = await this.repository.delete(...args);

    if (!result) throw new NotFoundError(`${this.entityName} not found`);

    return result;
  }
}
