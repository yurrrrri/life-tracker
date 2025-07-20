export const ColorType = {
  PASTEL_PINK: "PASTEL_PINK",
  BABY_BLUE: "BABY_BLUE",
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
  MISTY_ROSE: "MISTY_ROSE",
  LIGHT_CYAN: "LIGHT_CYAN",
  PALE_AQUA: "PALE_AQUA",
  BLUSH_PINK: "BLUSH_PINK",
  PERIWINKLE: "PERIWINKLE",
  LIGHT_LAVENDER: "LIGHT_LAVENDER",
  PASTEL_TEAL: "PASTEL_TEAL",
} as const;

export const getColor = (type: string) => {
  if (type === "PASTEL_PINK") return "#FFD1DC";
  else if (type === "BABY_BLUE") return "#AEDFF7";
  else if (type === "MINT_GREEN") return "#BFFCC6";
  else if (type === "LAVENDER") return "#E3D1FF";
  else if (type === "PEACH") return "#FFE0B2";
  else if (type === "SKY_BLUE") return "#C2F0FF";
  else if (type === "PALE_YELLOW") return "#FFFACD";
  else if (type === "SOFT_LILAC") return "#D8B7DD";
  else if (type === "PASTEL_ORANGE") return "#FFD8B1";
  else if (type === "POWDER_BLUE") return "#B0E0E6";
  else if (type === "LIGHT_CORAL") return "#F8C8C8";
  else if (type === "PALE_GREEN") return "#D5F4E6";
  else if (type === "CREAM") return "#FFFDD0";
  else if (type === "MISTY_ROSE") return "#FFE4E1";
  else if (type === "LIGHT_CYAN") return "#E0FFFF";
  else if (type === "PALE_AQUA") return "#CFFFE5";
  else if (type === "BLUSH_PINK") return "#F9D5D3";
  else if (type === "PERIWINKLE") return "#CCCCFF";
  else if (type === "LIGHT_LAVENDER") return "#E6E6FA";
  else if (type === "PASTEL_TEAL") return "#A0E7E5";
  else return "#ffffff";
};
