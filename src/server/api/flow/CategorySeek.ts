import { Category } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/api/categories${path}`;

export const findCategory = ({ id }: { id: string }) => {
  return axios.get<Category>(url(`/${id}`));
};

export const findCategories = () => {
  return axios.get<Category[]>(url(""));
};

export default {
  findCategory,
  findCategories,
  query: {
    findCategory: (params: { id: string }) => ({
      queryKey: ["journal", "findCategory", params],
      queryFn: async ({ queryKey }: { queryKey: readonly any[] }) =>
        (await findCategory(queryKey.slice().pop()))?.data,
    }),
    findCategories: () => ({
      queryKey: ["journal", "findCategories"],
      queryFn: async ({}: { queryKey: readonly any[] }) =>
        (await findCategories())?.data,
    }),
  },
};
