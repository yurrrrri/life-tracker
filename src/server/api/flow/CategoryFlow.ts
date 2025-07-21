import { CategoryCdo, ColorType } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/categories${path}`;

export function CategoryFlow() {
  const create = (params: CategoryCdo) => axios.post(url(""), params);

  const update = (params: {
    id: string;
    name: string;
    colorType: keyof typeof ColorType;
  }) => axios.patch(url(""), params);

  const remove = ({ id }: { id: string }) => axios.patch(url(`/${id}`));

  return {
    create,
    update,
    remove,
  };
}
