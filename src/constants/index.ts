import {
  FaRegAngry,
  FaRegFrown,
  FaRegGrin,
  FaRegHeart,
  FaRegSadTear,
  FaRegSmile,
  FaRegSurprise,
  FaRegTired,
} from "react-icons/fa";
import {
  MdOutlineMoodBad,
  MdOutlineSentimentNeutral,
  MdOutlineSentimentSatisfied,
  MdOutlineSentimentVeryDissatisfied,
  MdOutlineSentimentVerySatisfied,
} from "react-icons/md";
import {
  WiCloudy,
  WiDaySunny,
  WiFog,
  WiRain,
  WiSnow,
  WiStrongWind,
  WiThermometer,
  WiThermometerExterior,
  WiThunderstorm,
} from "react-icons/wi";

import { Feeling, Weather } from "@/types";

// Weather icons mapping
export const WEATHER_ICONS = {
  [Weather.SUNNY]: WiDaySunny,
  [Weather.PARTLY_CLOUDY]: WiDaySunny,
  [Weather.CLOUDY]: WiCloudy,
  [Weather.LIGHT_RAIN]: WiRain,
  [Weather.HEAVY_RAIN]: WiRain,
  [Weather.SLEET]: WiSnow,
  [Weather.SNOW]: WiSnow,
  [Weather.HEAT_WAVE]: WiThermometer,
  [Weather.COLD_WAVE]: WiThermometerExterior,
  [Weather.WINDY]: WiStrongWind,
  [Weather.FOGGY]: WiFog,
  [Weather.THUNDER]: WiThunderstorm,
  [Weather.TYPHOON]: WiStrongWind,
};

// Weather labels
export const WEATHER_LABELS = {
  [Weather.SUNNY]: "햇빛쨍쨍",
  [Weather.PARTLY_CLOUDY]: "적당히맑음",
  [Weather.CLOUDY]: "뭉게구름",
  [Weather.LIGHT_RAIN]: "조금 흐림",
  [Weather.HEAVY_RAIN]: "흐림",
  [Weather.SLEET]: "안개",
  [Weather.SNOW]: "번개",
  [Weather.HEAT_WAVE]: "보슬비",
  [Weather.COLD_WAVE]: "장대비",
  [Weather.WINDY]: "진눈깨비",
  [Weather.FOGGY]: "함박눈",
  [Weather.THUNDER]: "무더위",
  [Weather.TYPHOON]: "한파",
};

// Feeling icons mapping
export const FEELING_ICONS = {
  [Feeling.NEUTRAL]: MdOutlineSentimentNeutral,
  [Feeling.CALM]: FaRegSmile,
  [Feeling.SAD]: FaRegFrown,
  [Feeling.DEPRESSED]: MdOutlineSentimentVeryDissatisfied,
  [Feeling.MELANCHOLY]: FaRegSadTear,
  [Feeling.ANGRY]: FaRegAngry,
  [Feeling.PASSIONATE]: FaRegHeart,
  [Feeling.HAPPY]: FaRegGrin,
  [Feeling.JOYFUL]: MdOutlineSentimentVerySatisfied,
  [Feeling.TIRED]: FaRegTired,
  [Feeling.IRRITATED]: MdOutlineMoodBad,
  [Feeling.SURPRISED]: FaRegSurprise,
  [Feeling.INTERESTED]: MdOutlineSentimentSatisfied,
};

// Feeling labels
export const FEELING_LABELS = {
  [Feeling.NEUTRAL]: "그럭저럭",
  [Feeling.CALM]: "평온",
  [Feeling.SAD]: "상심",
  [Feeling.DEPRESSED]: "우울",
  [Feeling.MELANCHOLY]: "슬픔",
  [Feeling.ANGRY]: "화남",
  [Feeling.PASSIONATE]: "열정",
  [Feeling.HAPPY]: "행복",
  [Feeling.JOYFUL]: "즐거움",
  [Feeling.TIRED]: "피곤",
  [Feeling.IRRITATED]: "짜증",
  [Feeling.SURPRISED]: "당황",
  [Feeling.INTERESTED]: "흥미",
};

// Category colors
export const CATEGORY_COLORS = [
  "#E53E3E", // red
  "#DD6B20", // orange
  "#D69E2E", // yellow
  "#38A169", // green
  "#319795", // teal
  "#3182CE", // blue
  "#805AD5", // purple
  "#D53F8C", // pink
  "#718096", // gray
  "#2D3748", // dark gray
  "#48BB78", // light green
  "#F6AD55", // light orange
  "#F6E05E", // light yellow
  "#9F7AEA", // light purple
  "#FC8181", // light red
  "#81C784", // light green
  "#64B5F6", // light blue
  "#F06292", // light pink
  "#A1887F", // brown
  "#90A4AE", // blue gray
];

// App constants
export const APP_CONSTANTS = {
  MAX_WEATHER_COMMENT: 20,
  MAX_FEELING_COMMENT: 30,
  MAX_JOURNAL_CONTENTS: 1000,
  MAX_JOURNAL_MEMO: 100,
  MAX_TODO_CONTENTS: 30,
  MAX_TODO_MEMO: 50,
  MAX_CATEGORIES: 20,
  MAX_IMAGES_PER_JOURNAL: 2,
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png"],
  SERVICE_START_DATE: "2025-01-01",
  PASSWORD_ATTEMPT_LIMIT: 5,
  PASSWORD_ATTEMPT_WINDOW: 10 * 60 * 1000, // 10 minutes
  MIN_JOURNALS_FOR_STATS: {
    MONTHLY: 10,
    QUARTERLY: 30,
    YEARLY: 100,
  },
  MAIN_GRID_WIDTH: 1000, // px
};

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  JOURNAL: "/journal",
  JOURNAL_WRITE: "/journal/write",
  JOURNAL_VIEW: "/journal/view/:id",
  TODO: "/todo",
  TODO_WRITE: "/todo/write",
  TODO_VIEW: "/todo/view/:id",
  SENTENCE: "/sentence",
  SENTENCE_WRTE: "/sentence/write",
  SENTENCE_VIEW: "/sentence/view/:id",
  GALLERY: "/gallery",
  STATS: "/stats",
  SETTINGS: "/settings",
  PROFILE: "/profile",
  CATEGORIES: "/categories",
  ANNIVERSARIES: "/anniversaries",
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_SETTINGS: "user_settings",
  THEME_MODE: "theme_mode",
  LAST_VISITED_DATE: "last_visited_date",
};
