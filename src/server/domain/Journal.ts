import { FeelingComment, WeatherComment } from "./vo";

export interface Journal {
  id: string;
  date: string; // format: 0000-00-00
  weatherComment?: WeatherComment;
  feelingComment?: FeelingComment;
  contents: string;
  imageId1?: string;
  imageId2?: string;
  memo?: string;
  saved: boolean;
  locked: boolean;
  registeredOn: number;
  modifiedOn: number;
}
