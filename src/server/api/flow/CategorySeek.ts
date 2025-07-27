import { Category } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/api/categories${path}`;

const findCategory = ({ id }: { id: string }) => {
  return axios.get<Category>(url(`/${id}`));
};

const findCategories = () => {
  return axios.get<Category[]>(url(""));
};

export default {
  findCategory,
  findCategories,
  query: {
    findCategory: (params: { id: string }) => ({
      queryKey: ["category", "findCategory", params],
      queryFn: async ({ queryKey }: { queryKey: readonly any[] }) =>
        (await findCategory(queryKey.slice().pop()))?.data,
    }),
    findCategories: () => ({
      queryKey: ["category", "findCategories"],
      queryFn: async ({}: { queryKey: readonly any[] }) =>
        (await findCategories())?.data,
    }),
  },
};
