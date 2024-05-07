import { extendTheme } from "@pigment-css/vite-plugin";

export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        background: "#FFFFFF",
        text: "#15111D",
        primary: "#8A63D2",
        border: "#2E3031",
        lightGrey: "#A0A3AD",
      },
    },
    dark: {
      palette: {
        background: "240 10% 3.9%",
        foreground: "0 0% 80%",
        primary: "0 0% 98%",
        border: "240 3.7% 15.9%",
      },
    },
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
