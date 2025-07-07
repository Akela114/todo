import { Service } from "@/lib/types.js";
import type { TagsRepository } from "./repository.js";

export class TagsService extends Service<TagsRepository> {
  constructor(protected repository: TagsRepository) {
    super(repository);
  }
}
