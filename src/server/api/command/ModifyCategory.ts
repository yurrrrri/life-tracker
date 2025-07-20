import { ColorType } from "@/server/domain";

export interface ModifyCategory {
  id: string;
  name: string;
  colorType: keyof typeof ColorType;
}
