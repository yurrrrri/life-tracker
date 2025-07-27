import { Profile } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/api/profiles${path}`;

const findProfile = () => {
  return axios.get<Profile[]>(url(""));
};

export default {
  findProfile,
  query: {
    findProfile: (params: { id: string }) => ({
      queryKey: ["profile", "findProfile", params],
      queryFn: async ({}: { queryKey: readonly any[] }) =>
        (await findProfile())?.data,
    }),
  },
};
