import { AnniversaryCdo, Weight } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/anniversaries${path}`;

export const AnniversaryFlow = {
  create: (params: AnniversaryCdo) => axios.post(url(""), params),

  update: (params: {
    id: string;
    date: string;
    name: string;
    weight: keyof typeof Weight;
  }) => axios.patch(url(""), params),

  remove: ({ id }: { id: string }) => axios.delete(url(`/${id}`)),
};
