export const TASK_PRIORITIES = {
  0: "Низкий",
  1: "Средний",
  2: "Высокий",
};

export const TASK_PRIORITIES_OPTIONS = Object.entries(TASK_PRIORITIES).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

export const TASK_REPETITION_TYPES = {
  weekDays: "По дням недели",
  monthDays: "По дням месяца",
  interval: "Через указанный интервал, дн.",
};

export const TASK_REPETITION_TYPES_OPTIONS = Object.entries(
  TASK_REPETITION_TYPES,
).map(([value, label]) => ({
  value,
  label,
}));
