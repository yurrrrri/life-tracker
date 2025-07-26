import { CategoryCdo, ColorType } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/api/categories${path}`;

export const CategoryFlow = {
  create: (params: CategoryCdo) => axios.post(url(""), params),

  update: (params: {
    id: string;
    name: string;
    colorType: keyof typeof ColorType;
  }) => axios.patch(url(""), params),

  remove: ({ id }: { id: string }) => axios.patch(url(`/${id}`)),
};
