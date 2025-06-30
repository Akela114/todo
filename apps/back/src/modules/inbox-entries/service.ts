import type { inboxEntry } from "@/db/schema.js";
import { BaseService } from "@/lib/base-classes/base-service.js";
import type { InboxEntriesRepository } from "./repository.js";
export class InboxEntriesService extends BaseService<
  typeof inboxEntry,
  "id",
  "userId"
> {
  constructor(protected repository: InboxEntriesRepository) {
    super(repository, "Inbox entry");
  }

  async getAllPaginated(
    ...args: Parameters<InboxEntriesRepository["getAllPaginated"]>
  ) {
    return this.repository.getAllPaginated(...args);
  }
}
