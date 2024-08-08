import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { pigment } from "@pigment-css/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import { theme } from "./src/theme/index";
import { config } from "dotenv";
import { readFileSync } from 'fs';
import { join } from 'path';

config({ path: ".env.local" });

const packageJsonPath = join(__dirname, 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const SDK_VERSION = packageJson.version;

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
  define: {
    "process.env": {
      ...process.env,
      SDK_VERSION: JSON.stringify(SDK_VERSION),
    },
  },
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