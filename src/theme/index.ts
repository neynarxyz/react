import { extendTheme } from "@pigment-css/vite-plugin";

export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        background: "#FFFFFF",
        border: "#E0E0E0",
        text: "#2B2432",
        textMuted: "#6A6A6C",
      },
    },
    dark: {
      palette: {
        background: "#15111D",
        border: "#2E3031",
        text: "#FFFFFF",
        textMuted: "#A0A3AD",
      },
    },
  },
  colors: {
    primary: "#8A63D2",
  },
  typography: {
    fonts: {
      base: "Sora, sans-serif",
    },
    fontWeights: {
      regular: 400,
      bold: 700,
    },
    fontSizes: {
      large: "20px",
      medium: "15px",
      small: "12px",
    },
  },
  getSelector: (colorScheme) =>
    colorScheme ? `.theme-${colorScheme}` : ":root",
});
