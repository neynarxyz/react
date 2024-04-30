import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { pigment, extendTheme } from "@pigment-css/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        background: "0 0% 100%",
        foreground: "240 10% 3.9%",
        primary: "240 5.9% 10%",
        border: "240 5.9% 90%",
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
  getSelector: (colorScheme) =>
    colorScheme ? `.theme-${colorScheme}` : ":root",
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    pigment({
      theme,
    }),
    react(),
    tsconfigPaths(),
    dts({
      insertTypesEntry: true, // This option adds an entry for the type definitions in your package.json
    }),
  ],
  build: {
    outDir: "dist",
    lib: {
      entry: "src/index.tsx",
      formats: ["es", "cjs"],
      fileName: (format) => `bundle.${format}.js`,
    },
    // rollupOptions: {
    //   external: ["react", "react-dom"],
    //   output: {
    //     globals: {
    //       react: "React",
    //       "react-dom": "ReactDOM",
    //     },
    //   },
    // },
  },
});
