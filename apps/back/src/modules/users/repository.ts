import { eq } from "drizzle-orm";
import { user } from "@/db/schema.js";
import { BaseRepository } from "@/lib/base-classes/base-repository.js";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export class UsersRepository extends BaseRepository<typeof user, "id"> {
  constructor(protected client: NodePgDatabase<Record<string, unknown>>) {
    super(client, user, "id");
  }

  async getOneByEmail(email: string) {
    const result = await this.client
      .select()
      .from(this.table)
      .where(eq(this.table.email, email));
    return result[0];
  }

  async getOneByUsername(username: string) {
    const result = await this.client
      .select()
      .from(this.table)
      .where(eq(this.table.username, username));
    return result[0];
  }
}
