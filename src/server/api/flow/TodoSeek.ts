import { Todo } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/api/todos${path}`;

const findDailyTodo = (params: { date: string }) => {
  return axios.post<Todo[]>(url("/daily"), params);
};

const findWeeklyTodo = (params: { date: string }) => {
  return axios.post<Todo[]>(url("/weekly"), params);
};

const findMonthlyTodo = (params: { date: string }) => {
  return axios.post<Todo[]>(url("/monthly"), params);
};

export default {
  findDailyTodo,
  findWeeklyTodo,
  findMonthlyTodo,
  query: {
    findDailyTodo: () => ({
      queryKey: ["todo", "findDailyTodo"],
      queryFn: async ({ queryKey }: { queryKey: readonly any[] }) =>
        (await findDailyTodo(queryKey.slice().pop()))?.data,
    }),
    findWeeklyTodo: () => ({
      queryKey: ["todo", "findWeeklyTodo"],
      queryFn: async ({ queryKey }: { queryKey: readonly any[] }) =>
        (await findWeeklyTodo(queryKey.slice().pop()))?.data,
    }),
    findMonthlyTodo: () => ({
      queryKey: ["todo", "findMonthlyTodo"],
      queryFn: async ({ queryKey }: { queryKey: readonly any[] }) =>
        (await findMonthlyTodo(queryKey.slice().pop()))?.data,
    }),
  },
};
