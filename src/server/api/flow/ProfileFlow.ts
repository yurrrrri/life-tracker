import { FontType } from "@/constants/types";
import { ProfileCdo } from "@/server/domain";
import axios from "axios";

const url = (path: string) => `/profiles${path}`;

export function ProfileFlow() {
  const create = (params: ProfileCdo) => axios.post(url(""), params);

  const changeName = (params: { id: string; name: string }) =>
    axios.patch(url(""), params, { headers: { command: "ChangeName" } });

  const changeBirthDate = (params: { id: string; birthDate: string }) =>
    axios.patch(url(""), params, { headers: { command: "ChangeBirthDate" } });

  const changePhoneNumber = (params: { id: string; phoneNumber: string }) =>
    axios.patch(url(""), params, { headers: { command: "ChangePhoneNumber" } });

  const changeRemark = (params: { id: string; remark: string }) =>
    axios.patch(url(""), params, { headers: { command: "ChangeRemark" } });

  const changePassword = (params: {
    id: string;
    oldPassword: string;
    newPassword: string;
  }) =>
    axios.patch(url(""), params, { headers: { command: "ChangePassword" } });

  const changeNotificationTime = (params: {
    id: string;
    notificationTime: Date;
  }) =>
    axios.patch(url(""), params, {
      headers: { command: "ChangeNotificationTime" },
    });

  const changeDarkMode = ({ id }: { id: string }) =>
    axios.patch(url(`/${id}`), { headers: { command: "ChangeDarkMode" } });

  const changeFontType = (params: {
    id: string;
    fontType: keyof typeof FontType;
  }) =>
    axios.patch(url(""), params, { headers: { command: "ChangeFontType" } });

  return {
    create,
    changeName,
    changeBirthDate,
    changePhoneNumber,
    changeRemark,
    changePassword,
    changeNotificationTime,
    changeDarkMode,
    changeFontType,
  };
}
