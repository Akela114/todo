import type { task } from "@/db/schema.js";
import { BaseService } from "@/lib/base-classes/base-service.js";
import { ConflictError } from "@/lib/errors/conflict-error.js";
import { NotFoundError } from "@/lib/errors/not-found-error.js";
import { TZDate } from "@date-fns/tz";
import type {
  CreateOrModifyTask,
  RepetitionRule,
  Task,
} from "@packages/schemas/task";
import {
  type Day,
  addDays,
  addMonths,
  compareAsc,
  format,
  getDaysInMonth,
  min,
  nextDay,
  setDate,
  startOfMonth,
} from "date-fns";
import type { PgQueryResultHKT, PgTransaction } from "drizzle-orm/pg-core";
import type { FastifyInstance } from "fastify";
import type { TasksRepository } from "./repository.js";

export class TasksService extends BaseService<typeof task, "id", "userId"> {
  constructor(
    private instance: FastifyInstance,
    protected repository: TasksRepository,
  ) {
    super(repository, "Task");
  }

  async convertInboxEntryToTask({
    id,
    userId,
    ...otherParams
  }: {
    id: number;
    userId: number;
  } & CreateOrModifyTask) {
    return await this.instance.db.transaction(async (tx) => {
      const inboxEntry = await this.instance.inboxEntryService.delete(
        id,
        { userId },
        tx,
      );

      if (!inboxEntry) {
        throw new NotFoundError(`${this.entityName} not found`);
      }

      const task = await this.create(
        {
          userId,
          ...otherParams,
        },
        tx,
      );

      return task;
    });
  }

  async getFilteredByDayWithPagination(
    ...args: Parameters<TasksRepository["getFilteredByDayWithPagination"]>
  ) {
    return await this.repository.getFilteredByDayWithPagination(...args);
  }

  async changeStatus(
    pKColumnValue: number,
    columnsToCheckAlwaysValues: Record<"userId", number>,
    doneDate: string | null,
  ) {
    return await this.instance.db.transaction(async (tx) => {
      const updatedTask = await this.update(
        pKColumnValue,
        columnsToCheckAlwaysValues,
        {
          doneDate,
        },
        tx,
      );

      if (!updatedTask.doneDate) {
        await this.deleteUndoneChildrenTask(
          columnsToCheckAlwaysValues.userId,
          pKColumnValue,
          tx,
        );
        if (updatedTask.parentTaskId) {
          await this.deleteTaskIfParentTaskUndone(
            columnsToCheckAlwaysValues.userId,
            updatedTask.parentTaskId,
            pKColumnValue,
            tx,
          );
        }
      } else {
        const childrenTask = await this.getChildrenTask(
          columnsToCheckAlwaysValues.userId,
          pKColumnValue,
          tx,
        );

        if (!childrenTask) {
          await this.createRepetativeChildrenTask(updatedTask, tx);
        }
      }

      return updatedTask;
    });
  }

  async updateTask(id: number, userId: number, data: CreateOrModifyTask) {
    return await this.repository.update(id, { userId }, data);
  }

  private async createRepetativeChildrenTask(
    task: Task & { userId: number },
    tx?: PgTransaction<PgQueryResultHKT, Record<string, unknown>>,
  ) {
    const taskCopy = structuredClone(task);

    if (!taskCopy.doneDate) return;

    if (taskCopy.repetitionRule) {
      const nextStartDate = this.getNextStartDateOfRepetativeTask({
        doneDate: taskCopy.doneDate,
        repetitionRule: taskCopy.repetitionRule,
      });

      if (
        !taskCopy.endDate ||
        compareAsc(nextStartDate, taskCopy.endDate) !== 1
      ) {
        await this.create(
          {
            title: taskCopy.title,
            userId: taskCopy.userId,
            startDate: nextStartDate,
            repetitionRule: taskCopy.repetitionRule,
            priority: taskCopy.priority,
            parentTaskId: taskCopy.id,
          },
          tx,
        );
      }
    }
  }

  private getNextStartDateOfRepetativeTask({
    doneDate,
    repetitionRule,
  }: {
    doneDate: string;
    repetitionRule: RepetitionRule;
  }) {
    if (!repetitionRule) return doneDate;

    // TODO: брать часовой пояс из профиля
    const dateWithTimezone = addDays(
      new TZDate(doneDate, "Asia/Yekaterinburg"),
      1,
    );

    if (repetitionRule.type === "weekDays") {
      const dateDayWeek = dateWithTimezone.getDay();

      if (
        repetitionRule.weekDays.includes(dateDayWeek > 0 ? dateDayWeek - 1 : 6)
      ) {
        return format(dateWithTimezone, "yyyy-MM-dd");
      }

      return repetitionRule.weekDays.length > 0
        ? // TODO: get from common helper
          format(
            min(
              repetitionRule.weekDays.map((day) =>
                nextDay(dateWithTimezone, (day < 6 ? day + 1 : 0) as Day),
              ),
            ),
            "yyyy-MM-dd",
          )
        : doneDate;
    }

    if (repetitionRule.type === "monthDays") {
      const sortedMonthDays = repetitionRule.monthDays.sort();
      for (
        let date = dateWithTimezone;
        ;
        date = startOfMonth(addMonths(date, 1))
      ) {
        const lastDayOfMonth = getDaysInMonth(date);
        for (const day of sortedMonthDays) {
          const candidateDate = setDate(date, Math.min(day, lastDayOfMonth));
          if (compareAsc(candidateDate, date) !== -1) {
            // TODO: get from common helper
            return format(candidateDate, "yyyy-MM-dd");
          }
        }
      }
    }

    return format(
      addDays(dateWithTimezone, repetitionRule.interval - 1),
      "yyyy-MM-dd",
    );
  }

  private async getChildrenTask(
    ...args: Parameters<TasksRepository["getChildrenTask"]>
  ) {
    return await this.repository.getChildrenTask(...args);
  }

  private async deleteUndoneChildrenTask(
    userId: number,
    parentTaskId: number,
    tx: PgTransaction<PgQueryResultHKT, Record<string, unknown>>,
  ) {
    const childrenTask = await this.getChildrenTask(userId, parentTaskId, tx);

    if (!childrenTask || childrenTask.doneDate) {
      return;
    }

    return this.delete(
      childrenTask.id,
      {
        userId,
      },
      tx,
    );
  }

  private async deleteTaskIfParentTaskUndone(
    userId: number,
    parentTaskId: number,
    taskId: number,
    tx: PgTransaction<PgQueryResultHKT, Record<string, unknown>>,
  ) {
    const parentTask = await this.getOne(parentTaskId, { userId }, tx);

    if (!parentTask.doneDate) {
      return this.delete(taskId, { userId }, tx);
    }

    return null;
  }
}
