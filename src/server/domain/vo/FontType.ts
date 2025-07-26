export const FontType = {
  GowunDodum: "GowunDodum",
  Hahmlet: "Hahmlet",
  YESMyoungjo: "YESMyoungjo",
  MaruBuri: "MaruBuri",
  Freesentation: "Freesentation",
  MinSans: "MinSans",
  SCoreDream: "SCoreDream",
  GangwonEdu: "GangwonEdu",
  Omyu: "Omyu",
} as const;

export const getFontName = (fontType: keyof typeof FontType) => {
  switch (fontType) {
    case "GowunDodum":
      return "고운돋움";
    case "Hahmlet":
      return "햄릿";
    case "YESMyoungjo":
      return "예스 명조";
    case "MaruBuri":
      return "마루 부리";
    case "Freesentation":
      return "프리젠테이션";
    case "MinSans":
      return "민산스";
    case "SCoreDream":
      return "에스코어드림";
    case "GangwonEdu":
      return "강원교육모두체";
    case "Omyu":
      return "오뮤 다예쁨체";
    default:
      return fontType;
  }
};
