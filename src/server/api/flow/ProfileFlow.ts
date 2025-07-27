import { FontType, ProfileCdo } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/api/profiles${path}`;

export const ProfileFlow = {
  create: (params: ProfileCdo) => axios.post(url(""), params),

  changeName: (params: { id: string; name: string }) =>
    axios.patch(url(""), params, { headers: { command: "ChangeName" } }),

  changeBirthDate: (params: { id: string; birthDate: string }) =>
    axios.patch(url(""), params, { headers: { command: "ChangeBirthDate" } }),

  changePhoneNumber: (params: { id: string; phoneNumber: string }) =>
    axios.patch(url(""), params, { headers: { command: "ChangePhoneNumber" } }),

  changeRemark: (params: { id: string; remark: string }) =>
    axios.patch(url(""), params, { headers: { command: "ChangeRemark" } }),

  changePassword: (params: {
    id: string;
    oldPassword: string;
    newPassword: string;
  }) =>
    axios.patch(url(""), params, { headers: { command: "ChangePassword" } }),

  changeNotificationTime: (params: { id: string; notificationTime: Date }) =>
    axios.patch(url(""), params, {
      headers: { command: "ChangeNotificationTime" },
    }),

  changeDarkMode: ({ id }: { id: string }) =>
    axios.patch(url(`/${id}`), { headers: { command: "ChangeDarkMode" } }),

  changeFontType: (params: { id: string; fontType: keyof typeof FontType }) =>
    axios.patch(url(""), params, { headers: { command: "ChangeFontType" } }),
};
