import { formatDate, formatDistance } from "@/shared/common-helpers";
import { CrossCircledIcon, TimerIcon } from "@radix-ui/react-icons";
import { addDays, differenceInMinutes, startOfDay } from "date-fns";
import { twMerge } from "tailwind-merge";

interface RemainingTimeProps {
  endDate: string | null;
}

export const RemainingTime = ({ endDate }: RemainingTimeProps) => {
  const getRemainingTimeElement = () => {
    const actualEndDate = endDate && startOfDay(addDays(endDate, 0));
    const now = new Date();

    if (!actualEndDate) {
      return null;
    }

    const differenceBetweenEndDateAndNow = differenceInMinutes(
      actualEndDate,
      now,
    );
    const isEndDateAfterTomorrow = differenceBetweenEndDateAndNow > 0;

    return isEndDateAfterTomorrow ? (
      <div className="tooltip" data-tip="Оставшееся время">
        <div
          className={twMerge(
            "flex items-center gap-1",
            differenceBetweenEndDateAndNow < 60 * 48 && "text-warning",
          )}
        >
          <TimerIcon />
          <div>
            {formatDistance(actualEndDate, now)} (по{" "}
            {formatDate(actualEndDate, "date")})
          </div>
        </div>
      </div>
    ) : (
      <div className="flex items-center gap-1 text-error">
        <CrossCircledIcon />
        <div>Просрочена</div>
      </div>
    );
  };

  return getRemainingTimeElement();
};
