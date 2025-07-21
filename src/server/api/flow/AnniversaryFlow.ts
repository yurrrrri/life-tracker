import { AnniversaryCdo, Weight } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/anniversaries${path}`;

export function AnniversaryFlow() {
  const create = (params: AnniversaryCdo) =>
    axios.post<string>(url(""), params);

  const update = (params: {
    id: string;
    date: string;
    name: string;
    weight: keyof typeof Weight;
  }) => axios.patch(url(""), params);

  const remove = ({ id }: { id: string }) => axios.delete(url(`/${id}`));

  return {
    create,
    update,
    remove,
  };
}
