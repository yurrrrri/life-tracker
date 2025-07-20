import { Status } from "./vo";

export interface Todo {
  id: string;
  categoryId: string;
  contents: string;
  memo: string;
  isPeriod: boolean; // true -> 기간, false -> 특정일
  startDateTime: Date;
  endDateTime: Date;
  status: keyof typeof Status;
  registeredOn: number;
}
