export const TASK_PRIORITIES = {
  0: "Низкий",
  1: "Средний",
  2: "Высокий",
};

export const TASK_PRIORITIES_OPTIONS = Object.entries(TASK_PRIORITIES).map(
  ([value, label]) => ({
    value,
    label,
  })
);
