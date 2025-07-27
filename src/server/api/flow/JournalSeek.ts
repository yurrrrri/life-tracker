import { Journal } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/api/journals${path}`;

const findDailyJournal = (params: { date: string }) => {
  return axios.post<Journal[]>(url("/daily"), params);
};

const findWeeklyJournal = (params: { date: string }) => {
  return axios.post<Journal[]>(url("/weekly"), params);
};

const findMonthlyJournal = (params: { date: string }) => {
  return axios.post<Journal[]>(url("/monthly"), params);
};

export default {
  findDailyJournal,
  findWeeklyJournal,
  findMonthlyJournal,
  query: {
    findDailyJournal: () => ({
      queryKey: ["journal", "findDailyJournal"],
      queryFn: async ({ queryKey }: { queryKey: readonly any[] }) =>
        (await findDailyJournal(queryKey.slice().pop()))?.data,
    }),
    findWeeklyJournal: () => ({
      queryKey: ["journal", "findWeeklyJournal"],
      queryFn: async ({ queryKey }: { queryKey: readonly any[] }) =>
        (await findWeeklyJournal(queryKey.slice().pop()))?.data,
    }),
    findMonthlyJournal: () => ({
      queryKey: ["journal", "findMonthlyJournal"],
      queryFn: async ({ queryKey }: { queryKey: readonly any[] }) =>
        (await findMonthlyJournal(queryKey.slice().pop()))?.data,
    }),
  },
};
