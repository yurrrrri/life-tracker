import { Feeling, Weather } from "@/server";
import {
  BsEmojiAstonishedFill,
  BsEmojiExpressionlessFill,
  BsEmojiNeutralFill,
  BsEmojiSunglassesFill,
} from "react-icons/bs";
import {
  FaAngry,
  FaDizzy,
  FaFrown,
  FaGrimace,
  FaGrin,
  FaGrinWink,
  FaKissWinkHeart,
  FaLaughBeam,
  FaSadCry,
  FaSadTear,
  FaSmile,
  FaSurprise,
} from "react-icons/fa";
import {
  WiCloudy,
  WiCloudyWindy,
  WiDayCloudy,
  WiDayFog,
  WiDayLightWind,
  WiDaySunny,
  WiDaySunnyOvercast,
  WiFog,
  WiRain,
  WiRainMix,
  WiRainWind,
  WiShowers,
  WiSnow,
  WiStrongWind,
  WiThunderstorm,
  WiWindy,
} from "react-icons/wi";

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

// Weather icons mapping
export const WEATHER_ICONS = {
  [Weather.CLOUDY]: WiCloudy,
  [Weather.CLOUDY_WINDY]: WiCloudyWindy,
  [Weather.DAY_CLOUDY]: WiDayCloudy,
  [Weather.DAY_FOG]: WiDayFog,
  [Weather.DAY_LIGHT_WIND]: WiDayLightWind,
  [Weather.SUNNY]: WiDaySunny,
  [Weather.SUNNY_OVERCAST]: WiDaySunnyOvercast,
  [Weather.FOG]: WiFog,
  [Weather.RAIN]: WiRain,
  [Weather.RAIN_MIX]: WiRainMix,
  [Weather.RAIN_WIND]: WiRainWind,
  [Weather.SHOWERS]: WiShowers,
  [Weather.SNOW]: WiSnow,
  [Weather.WINDY]: WiWindy,
  [Weather.STRONG_WIND]: WiStrongWind,
  [Weather.THUNDERSTORM]: WiThunderstorm,
};

// Weather labels
export const WEATHER_NAME = {
  [Weather.SUNNY]: "햇빛 쨍쨍",
  [Weather.SUNNY_OVERCAST]: "맑음",
  [Weather.CLOUDY]: "뭉게구름",
  [Weather.DAY_CLOUDY]: "조금 흐림",
  [Weather.DAY_FOG]: "흐림",
  [Weather.CLOUDY_WINDY]: "흐리고 바람",
  [Weather.DAY_LIGHT_WIND]: "바람 조금",
  [Weather.FOG]: "안개",
  [Weather.RAIN]: "보슬비",
  [Weather.RAIN_MIX]: "진눈깨비",
  [Weather.RAIN_WIND]: "장대비",
  [Weather.SHOWERS]: "소나기",
  [Weather.SNOW]: "함박눈",
  [Weather.WINDY]: "바람",
  [Weather.STRONG_WIND]: "한파",
  [Weather.THUNDERSTORM]: "태풍",
};

// Feeling icons mapping
export const FEELING_ICONS = {
  [Feeling.ANGRY]: FaAngry,
  [Feeling.ASTONISHED]: BsEmojiAstonishedFill,
  [Feeling.DIZZY]: FaDizzy,
  [Feeling.EXPRESSIONLESS]: BsEmojiExpressionlessFill,
  [Feeling.FROWN]: FaFrown,
  [Feeling.GRIMACE]: FaGrimace,
  [Feeling.GRIN]: FaGrin,
  [Feeling.MELANCHOLY]: FaSadCry,
  [Feeling.KISS]: FaKissWinkHeart,
  [Feeling.LAUGHING]: FaLaughBeam,
  [Feeling.NEUTRAL]: BsEmojiNeutralFill,
  [Feeling.SMILE]: FaSmile,
  [Feeling.SUNGLASSES]: BsEmojiSunglassesFill,
  [Feeling.SURPRISE]: FaSurprise,
  [Feeling.TEAR]: FaSadTear,
  [Feeling.WINK]: FaGrinWink,
};

// Feeling labels
export const FEELING_NAME = {
  [Feeling.ANGRY]: "화남",
  [Feeling.ASTONISHED]: "당황",
  [Feeling.DIZZY]: "피곤",
  [Feeling.EXPRESSIONLESS]: "그럭저럭",
  [Feeling.FROWN]: "짜증",
  [Feeling.GRIMACE]: "상심",
  [Feeling.GRIN]: "즐거움",
  [Feeling.MELANCHOLY]: "슬픔",
  [Feeling.KISS]: "사랑",
  [Feeling.LAUGHING]: "행복",
  [Feeling.NEUTRAL]: "평온",
  [Feeling.SMILE]: "좋음",
  [Feeling.SUNGLASSES]: "열정",
  [Feeling.SURPRISE]: "놀람",
  [Feeling.TEAR]: "우울",
  [Feeling.WINK]: "흥미",
};

// Category colors
export const COLOR_NAMES = [
  "LIGHT_LAVENDER",
  "MISTY_ROSE",
  "PEACH",
  "PASTEL_PINK",
  "LIGHT_CORAL",
  "PASTEL_ORANGE",
  "BLUSH_PINK",
  "PALE_YELLOW",
  "CREAM",
  "PALE_AQUA",
  "PALE_GREEN",
  "MINT_GREEN",
  "LIGHT_CYAN",
  "PASTEL_TEAL",
  "POWDER_BLUE",
  "SKY_BLUE",
  "BABY_BLUE",
  "LAVENDER",
  "SOFT_LILAC",
  "PERIWINKLE",
];
