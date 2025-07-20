export interface Profile {
  id: string;
  name: string;
  birthDate: string; // format: 0000-00-00
  phoneNumber: string;
  remark: string;
  password: string;
  notificationTime: Date;
  isDark: boolean;
  fontType: string; // TODO
  registeredOn: number;
  modifiedOn: number;
}
