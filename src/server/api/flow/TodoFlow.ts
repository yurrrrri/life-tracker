import { Status, TodoCdo } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/todos${path}`;

export function TodoFlow() {
  const create = (params: TodoCdo) => axios.post(url(""), params);

  const update = (params: {
    id: string;
    categoryId: string;
    contents: string;
    memo: string;
    isPeriod: boolean;
    startDateTime: Date;
    endDateTime: Date;
    status: keyof typeof Status;
  }) => axios.put(url(""), params);

  const changeTodoStatus = (params: {
    id: string;
    status: keyof typeof Status;
  }) => axios.patch(url(""), params);

  const remove = ({ id }: { id: string }) => axios.patch(url(`/${id}`));

  return {
    create,
    update,
    changeTodoStatus,
    remove,
  };
}
