export const Feeling = {
  ANGRY: "ANGRY",
  ASTONISHED: "ASTONISHED",
  DIZZY: "DIZZY",
  EXPRESSIONLESS: "EXPRESSIONLESS",
  FROWN: "FROWN",
  GRIMACE: "GRIMACE",
  GRIN: "GRIN",
  MELANCHOLY: "MELANCHOLY",
  KISS: "KISS",
  LAUGHING: "LAUGHING",
  NEUTRAL: "NEUTRAL",
  SMILE: "SMILE",
  SUNGLASSES: "SUNGLASSES",
  SURPRISE: "SURPRISE",
  TEAR: "TEAR",
  WINK: "WINK",
} as const;

export const getFeelingEnum = (value: string) => {
  if (value === "ANGRY") return Feeling.ANGRY;
  else if (value === "ASTONISHED") return Feeling.ASTONISHED;
  else if (value === "DIZZY") return Feeling.DIZZY;
  else if (value === "EXPRESSIONLESS") return Feeling.EXPRESSIONLESS;
  else if (value === "FROWN") return Feeling.FROWN;
  else if (value === "GRIMACE") return Feeling.GRIMACE;
  else if (value === "GRIN") return Feeling.GRIN;
  else if (value === "MELANCHOLY") return Feeling.MELANCHOLY;
  else if (value === "KISS") return Feeling.KISS;
  else if (value === "LAUGHING") return Feeling.LAUGHING;
  else if (value === "NEUTRAL") return Feeling.NEUTRAL;
  else if (value === "SMILE") return Feeling.SMILE;
  else if (value === "SUNGLASSES") return Feeling.SUNGLASSES;
  else if (value === "SURPRISE") return Feeling.SURPRISE;
  else if (value === "TEAR") return Feeling.TEAR;
  else if (value === "WINK") return Feeling.WINK;
  else return "";
};
