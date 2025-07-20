import { Status } from "@/server/domain";

export interface ChangeTodoStatus {
  id: string;
  status: keyof typeof Status;
}
