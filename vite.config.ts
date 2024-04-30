import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import { pigment } from "@pigment-css/vite-plugin";

export default defineConfig({
  plugins: [
    pigment({ theme: {} }),
    react(), // Supports React JSX
    tsconfigPaths(), // Supports TS path aliasing
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
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
