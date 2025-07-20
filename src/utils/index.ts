import { APP_CONSTANTS } from "@/constants/data";
import { TodoStatus } from "@/constants/types";
import dayjs from "dayjs";

// Date utilities
export const formatDate = (date?: dayjs.ConfigType): string => {
  return dayjs(date).format("YYYY년 M월 D일");
};

export const formatDateTime = (date?: dayjs.ConfigType): string => {
  return dayjs(date).format("YYYY년 M월 D일 HH시 mm분");
};

export const isToday = (date?: dayjs.ConfigType): boolean => {
  return dayjs(date).isSame(new Date(), "date");
};

export const isDateFuture = (date?: dayjs.ConfigType): boolean => {
  return dayjs(date).isAfter(new Date(), "date");
};

export const isDatePast = (date?: dayjs.ConfigType): boolean => {
  return dayjs(date).isBefore(new Date(), "date");
};

export const getStartOfDay = (date?: dayjs.ConfigType): Date => {
  return dayjs(date).startOf("month").toDate();
};

export const getEndOfDay = (date?: dayjs.ConfigType): Date => {
  return dayjs(date).endOf("month").toDate();
};

// Validation utilities
export const validatePassword = (password: string): boolean => {
  return password.length >= 4;
};

export const validateImageFile = (file: File): boolean => {
  const isValidType = APP_CONSTANTS.SUPPORTED_IMAGE_TYPES.includes(file.type);
  const isValidSize = file.size <= APP_CONSTANTS.MAX_IMAGE_SIZE;
  return isValidType && isValidSize;
};

export const validateJournalContents = (contents: string): boolean => {
  return contents.length <= APP_CONSTANTS.MAX_JOURNAL_CONTENTS;
};

export const validateTodoContents = (contents: string): boolean => {
  return (
    contents.length <= APP_CONSTANTS.MAX_TODO_CONTENTS && contents.length > 0
  );
};

// String utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Array utilities
export const groupBy = <T, K extends keyof any>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const group = key(item);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

export const uniqueBy = <T, K extends keyof any>(
  array: T[],
  key: (item: T) => K
): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

// Status utilities
export const getTodoStatusColor = (status: TodoStatus): string => {
  switch (status) {
    case TodoStatus.NOT_STARTED:
      return "gray";
    case TodoStatus.JUST_STARTED:
      return "blue";
    case TodoStatus.IN_PROGRESS:
      return "yellow";
    case TodoStatus.PENDING:
      return "orange";
    case TodoStatus.ONEDAY:
      return "purple";
    case TodoStatus.DONE:
      return "green";
    default:
      return "gray";
  }
};

export const getTodoStatusLabel = (status: TodoStatus): string => {
  switch (status) {
    case TodoStatus.NOT_STARTED:
      return "시작 전";
    case TodoStatus.JUST_STARTED:
      return "시작됨";
    case TodoStatus.IN_PROGRESS:
      return "진행 중";
    case TodoStatus.PENDING:
      return "대기 중";
    case TodoStatus.ONEDAY:
      return "하루만";
    case TodoStatus.DONE:
      return "완료";
    default:
      return "알 수 없음";
  }
};

// File utilities
export const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Local storage utilities
export const setLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Error handling
export const handleError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "알 수 없는 오류가 발생했습니다.";
};

// Date range utilities
export const getMonthRange = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
};

export const getWeekRange = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start, end };
};

// Service date validation
export const isServiceDate = (date: string): boolean => {
  const serviceStart = new Date(APP_CONSTANTS.SERVICE_START_DATE);
  const checkDate = new Date(date);
  return checkDate >= serviceStart;
};

export const getMaxServiceDate = (): string => {
  const today = new Date();
  const currentYear = today.getFullYear();
  return `${currentYear}-12-31`;
};
