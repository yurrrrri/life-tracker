import { FeelingComment, WeatherComment } from "@/server/domain";

export interface ModifyJournal {
  id: string;
  date: string; // format: 0000-00-00
  weatherComment?: WeatherComment;
  feelingComment?: FeelingComment;
  contents: string;
  memo: string;
}
