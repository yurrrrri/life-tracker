import {
  Journal,
  Todo,
  Category,
  Profile,
  Image,
  Anniversary,
  Weather,
  Feeling,
  Status,
  DateType,
  Weight,
  FontType,
} from "@/server";
import dayjs from "dayjs";

// 샘플 카테고리 데이터
export const sampleCategories: Category[] = [
  {
    id: "1",
    name: "업무",
    colorType: "SKY_BLUE",
    orderNo: 1,
    removed: false,
  },
  {
    id: "2",
    name: "개인",
    colorType: "PERIWINKLE",
    orderNo: 2,
    removed: false,
  },
  {
    id: "3",
    name: "학습",
    colorType: "MISTY_ROSE",
    orderNo: 3,
    removed: false,
  },
  {
    id: "4",
    name: "운동",
    colorType: "CREAM",
    orderNo: 4,
    removed: false,
  },
];

// 샘플 일기 데이터
export const sampleJournals: Journal[] = [
  {
    id: "1",
    date: "2024-01-15",
    weatherComment: {
      weather: Weather.SUNNY,
      comment: "맑고 화창한 날씨",
    },
    feelingComment: {
      feeling: Feeling.LAUGHING,
      comment: "오늘은 정말 기분이 좋았다",
    },
    contents:
      "오늘은 정말 좋은 하루였다. 아침에 일찍 일어나서 산책을 다녀왔고, 점심에는 맛있는 음식을 먹었다. 오후에는 친구들과 만나서 즐거운 시간을 보냈다.",
    saved: true,
    locked: false,
    registeredOn: Date.now() - 86400000,
    modifiedOn: Date.now() - 86400000,
  },
  {
    id: "2",
    date: "2024-01-14",
    weatherComment: {
      weather: Weather.CLOUDY,
      comment: "구름이 많았지만 비는 안 왔다",
    },
    feelingComment: {
      feeling: Feeling.NEUTRAL,
      comment: "평온한 하루였다",
    },
    contents:
      "오늘은 집에서 책을 읽으며 평온한 시간을 보냈다. 비가 올 것 같았지만 다행히 오지 않아서 산책도 할 수 있었다.",
    saved: true,
    locked: false,
    registeredOn: Date.now() - 172800000,
    modifiedOn: Date.now() - 172800000,
  },
  {
    id: "3",
    date: "2024-01-13",
    weatherComment: {
      weather: Weather.RAIN,
      comment: "하루 종일 비가 왔다",
    },
    feelingComment: {
      feeling: Feeling.TEAR,
      comment: "비 오는 날이라 우울했다",
    },
    contents:
      "오늘은 하루 종일 비가 와서 집에만 있었다. 우울한 기분이었지만 집에서 영화를 보며 시간을 보냈다.",
    saved: true,
    locked: false,
    registeredOn: Date.now() - 259200000,
    modifiedOn: Date.now() - 259200000,
  },
];

// 샘플 할일 데이터
export const sampleTodos: Todo[] = [
  {
    id: "1",
    contents: "프로젝트 기획서 작성",
    memo: "다음 주까지 완료해야 함",
    startDateTime: dayjs("2025-07-15").toDate(),
    endDateTime: dayjs("2025-07-15").toDate(),
    isPeriod: true,
    status: Status.IN_PROGRESS,
    categoryId: "1",
    registeredOn: Date.now() - 86400000,
  },
  {
    id: "2",
    contents: "운동하기",
    memo: "헬스장에서 1시간",
    startDateTime: dayjs("2025-07-15").toDate(),
    endDateTime: dayjs("2025-07-15").toDate(),
    isPeriod: true,
    status: Status.NOT_STARTED,
    categoryId: "4",
    registeredOn: Date.now() - 86400000,
  },
  {
    id: "3",
    contents: "책 읽기",
    memo: "새로 산 소설책",
    startDateTime: dayjs("2025-07-15").toDate(),
    endDateTime: dayjs("2025-07-15").toDate(),
    isPeriod: true,
    status: Status.DONE,
    categoryId: "3",
    registeredOn: Date.now() - 86400000,
  },
  {
    id: "4",
    contents: "장보기",
    memo: "우유, 빵, 계란",
    startDateTime: dayjs("2025-07-15").toDate(),
    endDateTime: dayjs("2025-07-15").toDate(),
    isPeriod: true,
    status: Status.NOT_STARTED,
    categoryId: "2",
    registeredOn: Date.now() - 86400000,
  },
];

// 샘플 프로필 데이터
export const sampleProfile: Profile = {
  id: "1",
  name: "홍길동",
  birthDate: "1990-01-01",
  phoneNumber: "010-1234-5678",
  remark: "안녕하세요! 일기 앱을 사용하고 있는 홍길동입니다.",
  password: "password123",
  notificationTime: dayjs().startOf("d").hour(9).toDate(),
  isDark: false,
  fontType: FontType.GowunDodum,
  registeredOn: Date.now(),
  modifiedOn: Date.now(),
};

// 샘플 이미지 데이터
export const sampleImages: Image[] = [
  {
    id: "1",
    fileName: "sample1.jpg",
    path: "https://via.placeholder.com/300x200/3182CE/FFFFFF?text=Sample+1",
    forJournal: true,
    registeredOn: Date.now() - 86400000,
  },
  {
    id: "2",
    fileName: "sample2.jpg",
    path: "https://via.placeholder.com/300x200/38A169/FFFFFF?text=Sample+2",
    forJournal: true,
    registeredOn: Date.now() - 86400000,
  },
  {
    id: "3",
    fileName: "sample3.jpg",
    path: "https://via.placeholder.com/300x200/D69E2E/FFFFFF?text=Sample+3",
    forJournal: false,
    registeredOn: Date.now() - 259200000,
  },
  {
    id: "4",
    fileName: "sample4.jpg",
    path: "https://via.placeholder.com/300x200/E53E3E/FFFFFF?text=Sample+4",
    forJournal: false,
    registeredOn: Date.now() - 432000000,
  },
];

// 샘플 기념일 데이터
export const sampleAnniversaries: Anniversary[] = [
  {
    id: "1",
    dateType: DateType.SPECIAL,
    date: "2024-02-14",
    name: "발렌타인데이",
    weight: Weight.FIRST,
    registeredOn: Date.now(),
    modifiedOn: Date.now(),
  },
  {
    id: "2",
    dateType: DateType.HOLIDAY,
    date: "2024-01-01",
    name: "신정",
    weight: Weight.SECOND,
    registeredOn: Date.now(),
    modifiedOn: Date.now(),
  },
  {
    id: "3",
    dateType: DateType.SPECIAL,
    date: "2024-03-14",
    name: "화이트데이",
    weight: Weight.SECOND,
    registeredOn: Date.now(),
    modifiedOn: Date.now(),
  },
  {
    id: "4",
    dateType: DateType.SPECIAL,
    date: "2024-05-05",
    name: "어린이날",
    weight: Weight.THIRD,
    registeredOn: Date.now(),
    modifiedOn: Date.now(),
  },
];

// 통계 데이터
export const sampleStats = {
  feelingStats: [
    { feeling: Feeling.LAUGHING, count: 5, percentage: 25 },
    { feeling: Feeling.NEUTRAL, count: 8, percentage: 40 },
    { feeling: Feeling.TEAR, count: 3, percentage: 15 },
    { feeling: Feeling.GRIN, count: 4, percentage: 20 },
  ],
  todoStats: [
    { status: Status.DONE, count: 12, percentage: 60 },
    { status: Status.IN_PROGRESS, count: 5, percentage: 25 },
    { status: Status.NOT_STARTED, count: 3, percentage: 15 },
  ],
};
