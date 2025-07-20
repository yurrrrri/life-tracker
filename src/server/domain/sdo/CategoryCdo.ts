import { ColorType } from "../vo";

export interface CategoryCdo {
  name: string;
  colorType: keyof typeof ColorType;
  orderNo: number;
  removed?: boolean;
}
