import { Weight } from "@/server/domain";

export interface ModifyAnniversary {
  id: string;
  date: string; // format: 0000-00-00
  name: string;
  weight: keyof typeof Weight;
}
