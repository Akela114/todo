import { task } from "@/db/schema.js";
import { BaseRepository } from "@/lib/base-classes/base-repository.js";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export class TasksRepository extends BaseRepository<
  typeof task,
  "id",
  "userId"
> {
  constructor(protected client: NodePgDatabase<Record<string, unknown>>) {
    super(client, task, "id", ["userId"]);
  }
}
