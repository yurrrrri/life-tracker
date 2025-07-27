import { History } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/api/histories${path}`;

const findHistory = ({ id }: { id: string }) => {
  return axios.get<History>(url(`/${id}`));
};

const findHistories = () => {
  return axios.get<History[]>(url(""));
};

export default {
  findHistory,
  findHistories,
  query: {
    findHistory: (params: { id: string }) => ({
      queryKey: ["history", "findHistory", params],
      queryFn: async ({ queryKey }: { queryKey: readonly any[] }) =>
        (await findHistory(queryKey.slice().pop()))?.data,
    }),
    findHistories: () => ({
      queryKey: ["history", "findHistories"],
      queryFn: async ({}: { queryKey: readonly any[] }) =>
        (await findHistories())?.data,
    }),
  },
};
