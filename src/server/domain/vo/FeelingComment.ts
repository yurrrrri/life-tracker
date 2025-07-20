import { Feeling } from "./Feeling";

export interface FeelingComment {
  feeling: keyof typeof Feeling;
  comment: string;
}
