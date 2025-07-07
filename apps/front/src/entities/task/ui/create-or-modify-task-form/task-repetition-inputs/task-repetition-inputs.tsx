import { TASK_REPETITION_TYPES_OPTIONS } from "@/entities/task";
import { getInputValidation } from "@/shared/forms";
import {
  CheckboxInput,
  InputGroupWrapper,
  MonthDaysPicker,
  NumberInput,
  Select,
  WeekdaysPicker,
} from "@/shared/ui";
import type { CreateOrModifyTaskFrontForm } from "@packages/schemas/task";
import { Controller, useController, useFormContext } from "react-hook-form";

export const TaskRepetitionInputs = () => {
  const { control, formState, register } =
    useFormContext<CreateOrModifyTaskFrontForm>();

  const { field: repetitionRuleField } = useController({
    name: "repetitionRule",
    control,
  });

  const onRepetitionRuleTypeChange = (value?: string) => {
    switch (value) {
      case "weekDays":
        repetitionRuleField.onChange({
          type: value,
          weekDays: [],
        });
        break;
      case "monthDays":
        repetitionRuleField.onChange({
          type: value,
          monthDays: [],
        });
        break;
      case "interval":
        repetitionRuleField.onChange({
          type: value,
          interval: 1,
        });
        break;
      default:
        repetitionRuleField.onChange(null);
    }
  };

  return (
    <InputGroupWrapper
      label="Правила повторения"
      inputValidation={getInputValidation(formState, "repetitionRule")}
    >
      <CheckboxInput
        checked={Boolean(repetitionRuleField.value)}
        onChange={() => {
          repetitionRuleField.value
            ? onRepetitionRuleTypeChange()
            : onRepetitionRuleTypeChange("weekDays");
        }}
      >
        Повторяемая задача?
      </CheckboxInput>
      {repetitionRuleField.value && (
        <Select
          value={repetitionRuleField.value?.type}
          onChange={onRepetitionRuleTypeChange}
          placeholder="Выберите тип правила..."
          label="Тип правила"
          options={TASK_REPETITION_TYPES_OPTIONS}
          inputValidation={getInputValidation(formState, "repetitionRule.type")}
        />
      )}
      {repetitionRuleField.value?.type === "weekDays" && (
        <Controller
          control={control}
          name="repetitionRule.weekDays"
          render={({ field: { value, onChange, ...field } }) => (
            <WeekdaysPicker
              {...field}
              selected={value ?? []}
              onChange={onChange}
              label="Дни недели"
              inputValidation={getInputValidation(
                formState,
                "repetitionRule.weekDays",
              )}
            />
          )}
        />
      )}
      {repetitionRuleField.value?.type === "monthDays" && (
        <Controller
          control={control}
          name="repetitionRule.monthDays"
          render={({ field: { value, onChange, ...field } }) => (
            <MonthDaysPicker
              {...field}
              selected={value ?? []}
              onChange={onChange}
              label="Дни месяца"
              inputValidation={getInputValidation(
                formState,
                "repetitionRule.monthDays",
              )}
            />
          )}
        />
      )}
      {repetitionRuleField.value?.type === "interval" && (
        <NumberInput
          {...register("repetitionRule.interval")}
          label="Интервал"
          inputValidation={getInputValidation(
            formState,
            "repetitionRule.interval",
          )}
        />
      )}
    </InputGroupWrapper>
  );
};
