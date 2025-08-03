import dayjs from "dayjs";

// Date utilities
export const format = (date: dayjs.ConfigType, format: string): string => {
  return dayjs(date).format(format);
};

export const formatDate = (date?: dayjs.ConfigType): string => {
  return dayjs(date).format("YYYY년 M월 D일");
};

export const formatDateTime = (date?: dayjs.ConfigType): string => {
  return dayjs(date).format("YYYY년 M월 D일 HH시 mm분");
};

export const isToday = (date?: dayjs.ConfigType): boolean => {
  return dayjs(date).isSame(new Date(), "date");
};

export const isFuture = (date?: dayjs.ConfigType): boolean => {
  return dayjs(date).isAfter(new Date(), "date");
};

export const isPast = (date?: dayjs.ConfigType): boolean => {
  return dayjs(date).isBefore(new Date(), "date");
};
