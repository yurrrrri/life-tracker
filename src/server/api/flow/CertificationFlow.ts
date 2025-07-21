import { CertificationCdo } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/certifications${path}`;

export function CertificationFlow() {
  const create = (params: CertificationCdo) => axios.post(url(""), params);

  const update = (params: {
    id: string;
    name: string;
    date: string;
    instituteName: string;
    imageId: string;
  }) => axios.put(url(""), params);

  const remove = ({ id }: { id: string }) => axios.delete(url(`/${id}`));

  return {
    create,
    update,
    remove,
  };
}
