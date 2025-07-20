import {
  Journal,
  Todo,
  Category,
  Profile,
  Settings,
  Image,
  Anniversary,
  Weather,
  Feeling,
  TodoStatus,
  AnniversaryType,
  AnniversaryWeight,
  FontType,
} from "@/constants/types";

// 샘플 카테고리 데이터
export const sampleCategories: Category[] = [
  {
    id: "1",
    name: "업무",
    color: "#3182CE",
    removed: false,
  },
  {
    id: "2",
    name: "개인",
    color: "#38A169",
    removed: false,
  },
  {
    id: "3",
    name: "학습",
    color: "#D69E2E",
    removed: false,
  },
  {
    id: "4",
    name: "운동",
    color: "#E53E3E",
    removed: false,
  },
];

// 샘플 일기 데이터
export const sampleJournals: Journal[] = [
  {
    id: "1",
    date: "2024-01-15",
    weather: Weather.SUNNY,
    weatherComment: "맑고 화창한 날씨",
    feeling: Feeling.HAPPY,
    feelingComment: "오늘은 정말 기분이 좋았다",
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
    weather: Weather.CLOUDY,
    weatherComment: "구름이 많았지만 비는 안 왔다",
    feeling: Feeling.CALM,
    feelingComment: "평온한 하루였다",
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
    weather: Weather.HEAVY_RAIN,
    weatherComment: "하루 종일 비가 왔다",
    feeling: Feeling.SAD,
    feelingComment: "비 오는 날이라 우울했다",
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
    startDateTime: "2024-01-15T09:00:00Z",
    endDateTime: "2024-01-15T18:00:00Z",
    isPeriod: true,
    status: TodoStatus.IN_PROGRESS,
    categoryId: "1",
    registeredOn: Date.now() - 86400000,
  },
  {
    id: "2",
    contents: "운동하기",
    memo: "헬스장에서 1시간",
    startDateTime: "2024-01-15T19:00:00Z",
    endDateTime: "2024-01-15T20:00:00Z",
    isPeriod: true,
    status: TodoStatus.NOT_STARTED,
    categoryId: "4",
    registeredOn: Date.now() - 86400000,
  },
  {
    id: "3",
    contents: "책 읽기",
    memo: "새로 산 소설책",
    startDateTime: "2024-01-15T21:00:00Z",
    endDateTime: "2024-01-15T22:00:00Z",
    isPeriod: true,
    status: TodoStatus.DONE,
    categoryId: "3",
    registeredOn: Date.now() - 86400000,
  },
  {
    id: "4",
    contents: "장보기",
    memo: "우유, 빵, 계란",
    startDateTime: "2024-01-16T10:00:00Z",
    endDateTime: "2024-01-16T11:00:00Z",
    isPeriod: true,
    status: TodoStatus.NOT_STARTED,
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
  registeredOn: Date.now(),
};

// 샘플 설정 데이터
export const sampleSettings: Settings = {
  id: "1",
  password: "password123",
  notificationTime: "09:00",
  isDark: false,
  fontType: FontType.DEFAULT,
  registeredOn: Date.now(),
};

// 샘플 이미지 데이터
export const sampleImages: Image[] = [
  {
    id: "1",
    filename: "sample1.jpg",
    path: "https://via.placeholder.com/300x200/3182CE/FFFFFF?text=Sample+1",
    forJournal: true,
    registeredOn: Date.now() - 86400000,
  },
  {
    id: "2",
    filename: "sample2.jpg",
    path: "https://via.placeholder.com/300x200/38A169/FFFFFF?text=Sample+2",
    forJournal: true,
    registeredOn: Date.now() - 86400000,
  },
  {
    id: "3",
    filename: "sample3.jpg",
    path: "https://via.placeholder.com/300x200/D69E2E/FFFFFF?text=Sample+3",
    forJournal: false,
    registeredOn: Date.now() - 259200000,
  },
  {
    id: "4",
    filename: "sample4.jpg",
    path: "https://via.placeholder.com/300x200/E53E3E/FFFFFF?text=Sample+4",
    forJournal: false,
    registeredOn: Date.now() - 432000000,
  },
];

// 샘플 기념일 데이터
export const sampleAnniversaries: Anniversary[] = [
  {
    id: "1",
    type: AnniversaryType.SPECIAL,
    date: "2024-02-14",
    name: "발렌타인데이",
    weight: AnniversaryWeight.HIGH,
    registeredOn: Date.now(),
    modifiedOn: Date.now(),
  },
  {
    id: "2",
    type: AnniversaryType.HOLIDAY,
    date: "2024-01-01",
    name: "신정",
    weight: AnniversaryWeight.MEDIUM,
    registeredOn: Date.now(),
    modifiedOn: Date.now(),
  },
  {
    id: "3",
    type: AnniversaryType.SPECIAL,
    date: "2024-03-14",
    name: "화이트데이",
    weight: AnniversaryWeight.MEDIUM,
    registeredOn: Date.now(),
    modifiedOn: Date.now(),
  },
  {
    id: "4",
    type: AnniversaryType.SPECIAL,
    date: "2024-05-05",
    name: "어린이날",
    weight: AnniversaryWeight.LOW,
    registeredOn: Date.now(),
    modifiedOn: Date.now(),
  },
];

// 통계 데이터
export const sampleStats = {
  feelingStats: [
    { feeling: Feeling.HAPPY, count: 5, percentage: 25 },
    { feeling: Feeling.CALM, count: 8, percentage: 40 },
    { feeling: Feeling.SAD, count: 3, percentage: 15 },
    { feeling: Feeling.JOYFUL, count: 4, percentage: 20 },
  ],
  todoStats: [
    { status: TodoStatus.DONE, count: 12, percentage: 60 },
    { status: TodoStatus.IN_PROGRESS, count: 5, percentage: 25 },
    { status: TodoStatus.NOT_STARTED, count: 3, percentage: 15 },
  ],
};
