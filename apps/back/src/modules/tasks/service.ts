import { NotFoundError } from "@/lib/errors/not-found-error.js";
import { Service, type Transaction } from "@/lib/types.js";
import { TZDate } from "@date-fns/tz";
import type {
  CreateOrModifyTaskBack,
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
import type { FastifyInstance } from "fastify";
import type { TasksRepository } from "./repository.js";
import type { PrimaryKeyFields, RequiredFields } from "./types.js";

export class TasksService extends Service<TasksRepository> {
  constructor(
    protected repository: TasksRepository,
    private instance: FastifyInstance,
  ) {
    super(repository);
  }

  async updateDoneDate(...args: Parameters<TasksRepository["updateDoneDate"]>) {
    return await this.repository.updateDoneDate(...args);
  }

  async convertInboxEntryToTask({
    inboxEntryId,
    userId,
    ...createTaskData
  }: {
    inboxEntryId: number;
  } & RequiredFields &
    CreateOrModifyTaskBack) {
    return this.repository.withTransaction(
      async (tx) => {
        const inboxEntry = await this.instance.inboxEntryService.delete(
          { userId, id: inboxEntryId },
          tx,
        );

        if (!inboxEntry) {
          throw new NotFoundError("Inbox entry not found");
        }

        const task = await this.create({ userId }, createTaskData, tx);

        return task;
      },
      undefined,
      true,
    );
  }

  async changeStatus(
    columnsToCheck: PrimaryKeyFields & RequiredFields,
    doneDate: string | null,
  ) {
    return this.repository.withTransaction(
      async (tx) => {
        const updatedTask = await this.updateDoneDate(
          columnsToCheck,
          {
            doneDate,
          },
          tx,
        );

        if (!updatedTask.doneDate) {
          await this.deleteUndoneChildrenTask(
            {
              parentTaskId: updatedTask.id,
              userId: updatedTask.userId,
            },
            tx,
          );
          if (updatedTask.parentTaskId) {
            await this.deleteTaskIfParentTaskUndone(
              {
                id: updatedTask.id,
                userId: updatedTask.userId,
                parentTaskId: updatedTask.parentTaskId,
              },
              tx,
            );
          }
        } else {
          const childrenTask = await this.getChildrenTask(
            {
              userId: updatedTask.userId,
              parentTaskId: updatedTask.id,
            },
            tx,
          );
          if (!childrenTask) {
            await this.createRepetativeChildrenTask(updatedTask, tx);
          }
        }

        return updatedTask;
      },
      undefined,
      true,
    );
  }

  private async getChildrenTask(
    filters: RequiredFields & { parentTaskId: number },
    tx?: Transaction,
  ) {
    return await this.getFirst(filters, tx);
  }

  private async deleteUndoneChildrenTask(
    data: RequiredFields & { parentTaskId: number },
    tx?: Transaction,
  ) {
    const childrenTask = await this.getChildrenTask(data, tx);

    if (!childrenTask || childrenTask.doneDate) {
      return;
    }

    return this.delete({ id: childrenTask.id, userId: data.userId }, tx);
  }

  private async deleteTaskIfParentTaskUndone(
    data: RequiredFields & PrimaryKeyFields & { parentTaskId: number },
    tx: Transaction,
  ) {
    const parentTask = await this.getFirst(
      {
        userId: data.userId,
        id: data.parentTaskId,
      },
      tx,
    );

    if (!parentTask?.doneDate) {
      return this.delete(
        {
          id: data.id,
          userId: data.userId,
        },
        tx,
      );
    }

    return null;
  }

  private async createRepetativeChildrenTask(
    task: Task & { userId: number },
    tx?: Transaction,
  ) {
    const { userId, tags, title, endDate, priority, repetitionRule, doneDate } =
      structuredClone(task);

    if (!doneDate) return;

    if (repetitionRule) {
      const nextStartDate = this.getNextStartDateOfRepetativeTask({
        doneDate,
        repetitionRule,
      });

      if (!endDate || compareAsc(nextStartDate, endDate) !== 1) {
        await this.create(
          {
            userId,
          },
          {
            title,
            priority,
            startDate: nextStartDate,
            endDate,
            repetitionRule,
            parentTaskId: task.id,
            tagIds: tags.map((tag) => tag.id),
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

    // 2019-12-31
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
}
