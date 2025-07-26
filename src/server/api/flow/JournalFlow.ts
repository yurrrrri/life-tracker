import { FeelingComment, JournalCdo, WeatherComment } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/journals${path}`;

export const JournalFlow = {
  create: (params: JournalCdo) => axios.post(url(""), params),

  update: (params: {
    id: string;
    date: string;
    weatherComment: WeatherComment;
    feelingComment: FeelingComment;
    contents: string;
    memo: string;
  }) => axios.put(url(""), params),

  changeJournalImage: (params: {
    id: string;
    image1Id: string;
    image2Id: string;
  }) =>
    axios.patch(url(""), params, {
      headers: { command: "ChangeJournalImage" },
    }),

  changeJournalLocked: ({ id }: { id: string }) =>
    axios.patch(url(`/${id}`), {
      headers: { command: "ChangeJournalLocked" },
    }),

  remove: ({ id }: { id: string }) => axios.patch(url(`/${id}`)),
};
