import { Certification } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/api/certifications${path}`;

const findCertification = ({ id }: { id: string }) => {
  return axios.get<Certification>(url(`/${id}`));
};

const findCertifications = () => {
  return axios.get<Certification[]>(url("/daily"));
};

export default {
  findCertification,
  findCertifications,
  query: {
    findCertification: (params: { id: string }) => ({
      queryKey: ["certification", "findCertification", params],
      queryFn: async ({ queryKey }: { queryKey: readonly any[] }) =>
        (await findCertification(queryKey.slice().pop()))?.data,
    }),
    findCertifications: () => ({
      queryKey: ["certification", "findCertifications"],
      queryFn: async ({}: { queryKey: readonly any[] }) =>
        (await findCertifications())?.data,
    }),
  },
};
