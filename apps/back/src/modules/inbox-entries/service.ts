import { Service } from "@/lib/types.js";
import type { InboxEntriesRepository } from "./repository.js";

export class InboxEntriesService extends Service<InboxEntriesRepository> {
  constructor(protected repository: InboxEntriesRepository) {
    super(repository);
  }
}
