import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
  Settings,
  Profile,
  Category,
  Todo,
  Journal,
  FontType,
} from "@/constants/types";
import { STORAGE_KEYS } from "@/constants/data";
import { formatDate } from ".";

// Auth state
export const isAuthenticatedAtom = atom<boolean>(false);
export const authTokenAtom = atomWithStorage<string | null>(
  STORAGE_KEYS.AUTH_TOKEN,
  null
);
export const passwordAttemptsAtom = atom<number>(0);
export const lastPasswordAttemptAtom = atom<number>(0);

// Settings state
export const settingsAtom = atom<Settings | null>(null);
export const isDarkModeAtom = atomWithStorage<boolean>(
  STORAGE_KEYS.THEME_MODE,
  false
);
export const fontTypeAtom = atom<FontType>("DEFAULT" as FontType);

// Profile state
export const profileAtom = atom<Profile | null>(null);

// Categories state
export const categoriesAtom = atom<Category[]>([]);

// Todos state
export const todosAtom = atom<Todo[]>([]);
export const selectedTodoAtom = atom<Todo | null>(null);

// Journals state
export const journalsAtom = atom<Journal[]>([]);
export const selectedJournalAtom = atom<Journal | null>(null);
export const selectedDateAtom = atom<string>(
  new Date().toISOString().split("T")[0]
);

// Calendar view state
export const calendarViewAtom = atom<"daily" | "weekly" | "monthly">("monthly");
export const currentDateAtom = atom<Date>(new Date());

// UI state
export const isLoadingAtom = atom<boolean>(false);
export const sidebarOpenAtom = atom<boolean>(false);
export const modalOpenAtom = atom<boolean>(false);
export const modalTypeAtom = atom<string>("");

// Form state
export const journalFormDataAtom = atom({
  date: formatDate(),
  weather: undefined,
  weatherComment: "",
  feeling: "NEUTRAL" as any,
  feelingComment: "",
  contents: "",
  images: [] as File[],
  memo: "",
  locked: false,
});

export const todoFormDataAtom = atom({
  categoryId: "",
  contents: "",
  memo: "",
  isPeriod: false,
  startDateTime: new Date().toISOString().slice(0, 16),
  endDateTime: new Date().toISOString().slice(0, 16),
  status: "NOT_STARTED" as any,
});

// Derived atoms
export const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom);
  const selectedDate = get(selectedDateAtom);

  return todos.filter((todo) => {
    const todoDate = formatDate(todo.startDateTime);
    return todoDate === selectedDate;
  });
});

export const filteredJournalsAtom = atom((get) => {
  const journals = get(journalsAtom);
  const selectedDate = get(selectedDateAtom);

  return journals.filter((journal) => journal.date === selectedDate);
});

export const categoriesByDateAtom = atom((get) => {
  const todos = get(todosAtom);
  const selectedDate = get(selectedDateAtom);
  const categories = get(categoriesAtom);

  const todoCategories = todos
    .filter((todo) => {
      const todoDate = formatDate(todo.startDateTime);
      return todoDate === selectedDate;
    })
    .map((todo) => todo.categoryId);

  return categories.filter(
    (category) => todoCategories.includes(category.id) && !category.removed
  );
});

// Stats atoms
export const feelingStatsAtom = atom<any[]>([]);
export const todoStatsAtom = atom<any[]>([]);

// Gallery state
export const galleryImagesAtom = atom<any[]>([]);
export const selectedImageAtom = atom<any | null>(null);
