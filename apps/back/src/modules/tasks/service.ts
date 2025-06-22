import type { task } from "@/db/schema.js";
import { BaseService } from "@/lib/base-classes/base-service.js";
import type { TasksRepository } from "./repository.js";

export class TasksService extends BaseService<typeof task, "id", "userId"> {
  constructor(protected repository: TasksRepository) {
    super(repository, "Task");
  }
}
