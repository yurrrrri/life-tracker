export const ColorType = {
  PASTEL_PINK: "PASTEL_PINK",
  BABY_BLUE: "BABY_BLUE",
  MISTY_ROSE: "MISTY_ROSE",
  MINT_GREEN: "MINT_GREEN",
  LAVENDER: "LAVENDER",
  PEACH: "PEACH",
  SKY_BLUE: "SKY_BLUE",
  PALE_YELLOW: "PALE_YELLOW",
  SOFT_LILAC: "SOFT_LILAC",
  PASTEL_ORANGE: "PASTEL_ORANGE",
  POWDER_BLUE: "POWDER_BLUE",
  LIGHT_CORAL: "LIGHT_CORAL",
  PALE_GREEN: "PALE_GREEN",
  CREAM: "CREAM",
  LIGHT_CYAN: "LIGHT_CYAN",
  PALE_AQUA: "PALE_AQUA",
  BLUSH_PINK: "BLUSH_PINK",
  PERIWINKLE: "PERIWINKLE",
  LIGHT_LAVENDER: "LIGHT_LAVENDER",
  PASTEL_TEAL: "PASTEL_TEAL",
} as const;

export const getColor = (type: string) => {
  if (type === "LIGHT_CORAL") return "#ffa0a0ff";
  else if (type === "MISTY_ROSE") return "#ffc8f1ff";
  else if (type === "BLUSH_PINK") return "#ffd9a4ff";
  else if (type === "PASTEL_PINK") return "#ffc0d0ff";
  else if (type === "PASTEL_ORANGE") return "#ffbc74ff";
  else if (type === "PEACH") return "rgba(255, 214, 225, 1)";
  else if (type === "PALE_YELLOW") return "#fff6a4ff";
  else if (type === "CREAM") return "#fff0d1ff";
  else if (type === "SKY_BLUE") return "#c2e3ffff";
  else if (type === "BABY_BLUE") return "#89c8ffff";
  else if (type === "POWDER_BLUE") return "#dcf5faff";
  else if (type === "LIGHT_CYAN") return "#cfffffff";
  else if (type === "PASTEL_TEAL") return "#9ffffcff";
  else if (type === "LIGHT_LAVENDER") return "#ff98fdff";
  else if (type === "LAVENDER") return "#e9c8ffff";
  else if (type === "SOFT_LILAC") return "#cabbffff";
  else if (type === "PERIWINKLE") return "#9898ffff";
  else if (type === "PALE_AQUA") return "#aaffd7ff";
  else if (type === "PALE_GREEN") return "#9cffb0ff";
  else if (type === "MINT_GREEN") return "#59ff38ff";
  else return "#FFD1DC";
};
