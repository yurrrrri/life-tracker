import { HistoryCdo } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/histories${path}`;

export function HistoryFlow() {
  const create = (params: HistoryCdo) => axios.post(url(""), params);

  const update = (params: {
    id: string;
    title: string;
    contents: string;
    startDateTime: Date;
    endDateTime: Date;
  }) => axios.put(url(""), params);

  const remove = ({ id }: { id: string }) => axios.delete(url(`/${id}`));

  return {
    create,
    update,
    remove,
  };
}
