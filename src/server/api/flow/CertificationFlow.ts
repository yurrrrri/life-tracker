import { CertificationCdo } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/certifications${path}`;

export const CertificationFlow = {
  create: (params: CertificationCdo) => axios.post(url(""), params),

  update: (params: {
    id: string;
    name: string;
    date: string;
    instituteName: string;
    imageId: string;
  }) => axios.put(url(""), params),

  remove: ({ id }: { id: string }) => axios.delete(url(`/${id}`)),
};
