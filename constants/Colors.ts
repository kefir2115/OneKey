export interface Color {
  background: string;
  font: string;
  lighterBackground: string;
  green: string;
  blue: string;
  orange: string;
}

export const Colors = {
  light: {
    background: "#F5F5F8",
    font: "#333333",
    lighterBackground: "#C8CCD9",
    green: "#60A8AA",
    blue: "#59C9EB",
    orange: "#F99677"
  } as Color,
  dark: {
    background: "#333333",
    font: "#F5F5F8",
    lighterBackground: "#5C5C5C",
    green: "#3B7779",
    blue: "#3C9BB8",
    orange: "#D37A5E"
  } as Color
}