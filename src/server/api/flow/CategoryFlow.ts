import { CategoryCdo, ColorType } from "@/server/domain";
import axios from "axios";
import { OrderInfo } from "../command/vo/OrderInfo";

const url = (path: string) => `/api/categories${path}`;

export const CategoryFlow = {
  create: (params: CategoryCdo) => axios.post(url(""), params),

  modifyOrder: (params: { orderInfos: OrderInfo[] }) =>
    axios.post(url("/reorder"), params),

  update: (params: {
    id: string;
    name: string;
    colorType: keyof typeof ColorType;
    orderNo: number;
  }) => axios.put(url(""), params),

  remove: ({ id }: { id: string }) => axios.delete(url(`/${id}`)),
};
