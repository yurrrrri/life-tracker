import { DateType, Weight } from "./vo";

export interface Anniversary {
  id: string;
  dateType: keyof typeof DateType;
  date: string; // format: 0000-00-00
  name: string;
  weight: keyof typeof Weight;
  registeredOn: number;
  modifiedOn: number;
}
