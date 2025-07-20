import { ColorType } from "./vo";

export interface Category {
  id: string;
  name: string;
  colorType: keyof typeof ColorType;
  orderNo: number;
  removed: boolean;
}
