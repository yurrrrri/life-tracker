import { FeelingComment, JournalCdo, WeatherComment } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/journals${path}`;

export function JournalFlow() {
  const create = (params: JournalCdo) => axios.post(url(""), params);

  const update = (params: {
    id: string;
    date: string;
    weatherComment: WeatherComment;
    feelingComment: FeelingComment;
    contents: string;
    memo: string;
  }) => axios.put(url(""), params);

  const changeJournalImage = (params: {
    id: string;
    image1Id: string;
    image2Id: string;
  }) =>
    axios.patch(url(""), params, {
      headers: { command: "ChangeJournalImage" },
    });

  const changeJournalLocked = ({ id }: { id: string }) =>
    axios.patch(url(`/${id}`), { headers: { command: "ChangeJournalLocked" } });

  const remove = ({ id }: { id: string }) => axios.patch(url(`/${id}`));

  return {
    create,
    update,
    changeJournalImage,
    changeJournalLocked,
    remove,
  };
}
