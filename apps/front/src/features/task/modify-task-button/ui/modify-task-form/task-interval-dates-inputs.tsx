import { formatDate, formatTodayDate } from "@/shared/common-helpers";
import { getInputValidation } from "@/shared/forms";
import { DayInput } from "@/shared/ui";
import type { ModifyTask } from "@packages/schemas/task";
import { compareAsc } from "date-fns";
import { useController, useFormContext } from "react-hook-form";

export const TaskIntervalDatesInputs = () => {
  const { control, formState } = useFormContext<ModifyTask>();

  const { field: startDateField } = useController({
    control,
    name: "startDate",
  });

  const { field: endDateField } = useController({
    control,
    name: "endDate",
  });

  const handleStartDateChange = (value?: Date) => {
    if (value) {
      startDateField.onChange(formatDate(value));
      if (endDateField.value && compareAsc(value, endDateField.value) === 1) {
        endDateField.onChange(value);
      }
      return;
    }

    return startDateField.onChange(formatTodayDate());
  };

  const handleEndDateChange = (value?: Date) => {
    endDateField.onChange(value ? formatDate(value) : null);
  };

  return (
    <>
      <DayInput
        {...startDateField}
        value={
          startDateField.value ? new Date(startDateField.value) : undefined
        }
        onChange={handleStartDateChange}
        placeholder="Укажите дату начала..."
        label="Дата начала"
        inputValidation={getInputValidation(formState, "startDate")}
        minDate={new Date()}
      />
      <DayInput
        {...endDateField}
        value={endDateField.value ? new Date(endDateField.value) : undefined}
        onChange={handleEndDateChange}
        placeholder="Укажите дату окончания..."
        label="Дата окончания"
        inputValidation={getInputValidation(formState, "endDate")}
        minDate={
          startDateField.value ? new Date(startDateField.value) : undefined
        }
      />
    </>
  );
};
