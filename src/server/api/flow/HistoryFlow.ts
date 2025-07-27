import { HistoryCdo } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/api/histories${path}`;

export const HistoryFlow = {
  create: (params: HistoryCdo) => axios.post(url(""), params),

  update: (params: {
    id: string;
    title: string;
    contents: string;
    startDateTime: Date;
    endDateTime: Date;
  }) => axios.put(url(""), params),

  remove: ({ id }: { id: string }) => axios.delete(url(`/${id}`)),
};
