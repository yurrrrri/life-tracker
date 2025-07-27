import { Anniversary } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/api/anniversaries${path}`;

const findAnniversary = ({ id }: { id: string }) => {
  return axios.get<Anniversary>(url(`/${id}`));
};

const findDailyAnniversaries = (params: { date: string }) => {
  return axios.post<Anniversary[]>(url("/daily"), params);
};

const findWeeklyAnniversaries = (params: { date: string }) => {
  return axios.post<Anniversary[]>(url("/weekly"), params);
};

const findMonthlyAnniversaries = (params: { date: string }) => {
  return axios.post<Anniversary[]>(url("/monthly"), params);
};

export default {
  findAnniversary,
  findDailyAnniversaries,
  findWeeklyAnniversaries,
  findMonthlyAnniversaries,
  query: {
    findAnniversary: (params: { id: string }) => ({
      queryKey: ["anniversary", "findAnniversary", params],
      queryFn: async ({ queryKey }: { queryKey: readonly any[] }) =>
        (await findAnniversary(queryKey.slice().pop()))?.data,
    }),
    findDailyAnniversaries: () => ({
      queryKey: ["anniversary", "findDailyAnniversaries"],
      queryFn: async ({ queryKey }: { queryKey: readonly any[] }) =>
        (await findDailyAnniversaries(queryKey.slice().pop()))?.data,
    }),
    findWeeklyAnniversaries: () => ({
      queryKey: ["anniversary", "findWeeklyAnniversaries"],
      queryFn: async ({ queryKey }: { queryKey: readonly any[] }) =>
        (await findWeeklyAnniversaries(queryKey.slice().pop()))?.data,
    }),
    findMonthlyAnniversaries: () => ({
      queryKey: ["anniversary", "findMonthlyAnniversaries"],
      queryFn: async ({ queryKey }: { queryKey: readonly any[] }) =>
        (await findMonthlyAnniversaries(queryKey.slice().pop()))?.data,
    }),
  },
};
