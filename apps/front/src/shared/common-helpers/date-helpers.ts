import { format, formatDistance as formatDistanceFns, parse } from "date-fns";
import { ru } from "date-fns/locale";

const FORMAT_TYPES = {
  transfer: "yyyy-MM-dd",
  date: "dd MMMM yyyy",
  weekdayDate: "EEEE, dd MMMM yyyy",
  timeDate: "dd MMMM yyyy, HH:mm",
};

export const formatDate = (
  date: Parameters<typeof format>[0],
  type: keyof typeof FORMAT_TYPES = "transfer",
) => {
  return format(date, FORMAT_TYPES[type], {
    locale: ru,
  });
};

export const formatDistance = (
  ...args: Parameters<typeof formatDistanceFns>
) => {
  return formatDistanceFns(args[0], args[1], {
    ...(args[2] ?? {}),
    locale: ru,
  });
};

export const parseDate = (date: string, type: keyof typeof FORMAT_TYPES) => {
  return parse(date, FORMAT_TYPES[type], new Date(), {
    locale: ru,
  });
};

export const formatTodayDate = () => formatDate(new Date());
