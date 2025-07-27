import { Status, TodoCdo } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/api/todos${path}`;

export const TodoFlow = {
  create: (params: TodoCdo) => axios.post(url(""), params),

  update: (params: {
    id: string;
    categoryId: string;
    contents: string;
    memo: string;
    isPeriod: boolean;
    startDateTime: Date;
    endDateTime: Date;
    status: keyof typeof Status;
  }) => axios.put(url(""), params),

  changeTodoStatus: (params: { id: string; status: keyof typeof Status }) =>
    axios.patch(url(""), params),

  remove: ({ id }: { id: string }) => axios.patch(url(`/${id}`)),
};
