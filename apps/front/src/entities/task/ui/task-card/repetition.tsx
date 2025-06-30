import { formatNounByNumber } from "@/shared/common-helpers-and-constants/string-helpers";
import { WEEK_DAYS } from "@/shared/common-helpers-and-constants/weekdays";
import type { RepetitionRule } from "@packages/schemas/task";
import { LoopIcon } from "@radix-ui/react-icons";

interface RepetitionProps {
  repetitionRule: RepetitionRule;
}

export const Repetition = ({ repetitionRule }: RepetitionProps) => {
  const getRepetitionInfo = () => {
    switch (repetitionRule.type) {
      case "weekDays":
        return repetitionRule.weekDays
          .sort()
          .map((day) => WEEK_DAYS[day as keyof typeof WEEK_DAYS] ?? day)
          .join(", ");
      case "monthDays":
        return `дни месяца - ${repetitionRule.monthDays.sort().join(", ")}`;
      case "interval": {
        const formattedPrefix = formatNounByNumber(1, [
          "каждый",
          "каждые",
          "каждые",
        ]);
        const formattedPostfix = formatNounByNumber(repetitionRule.interval, [
          "день",
          "дня",
          "дней",
        ]);

        return `${formattedPrefix}${repetitionRule.interval > 1 ? ` ${repetitionRule.interval}` : ""} ${formattedPostfix}`;
      }
    }
  };

  return (
    <div className="flex items-center gap-1">
      <LoopIcon />
      Повторяемая задача ({getRepetitionInfo()})
    </div>
  );
};
