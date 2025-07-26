import { ROUTES } from "@/utils/routes";
import React from "react";
import {
  FiBarChart,
  FiBook,
  FiCalendar,
  FiCheckSquare,
  FiHome,
  FiImage,
  FiPenTool,
  FiSettings,
  FiTag,
  FiUser,
} from "react-icons/fi";

export interface NavItem {
  label: string;
  icon: React.ReactElement;
  path: string;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    label: "홈",
    icon: <FiHome />,
    path: ROUTES.HOME,
  },
  {
    label: "일기",
    icon: <FiBook />,
    path: ROUTES.JOURNAL,
  },
  {
    label: "투두리스트",
    icon: <FiCheckSquare />,
    path: ROUTES.TODO,
  },
  {
    label: "필사노트",
    icon: <FiPenTool />,
    path: ROUTES.SENTENCE,
  },
  {
    label: "갤러리",
    icon: <FiImage />,
    path: ROUTES.GALLERY,
  },
  {
    label: "통계",
    icon: <FiBarChart />,
    path: ROUTES.STATS,
  },
  {
    label: "설정",
    icon: <FiSettings />,
    path: ROUTES.SETTINGS,
    children: [
      {
        label: "프로필",
        icon: <FiUser />,
        path: ROUTES.PROFILE,
      },
      {
        label: "카테고리",
        icon: <FiTag />,
        path: ROUTES.CATEGORIES,
      },
      {
        label: "특별한 날",
        icon: <FiCalendar />,
        path: ROUTES.ANNIVERSARIES,
      },
    ],
  },
];
