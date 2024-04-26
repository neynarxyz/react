import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import replace from "@rollup/plugin-replace";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: "dist/bundle.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/bundle.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  external: ["react", "react-dom", "@emotion/react", "@emotion/styled"], // Avoid bundling React and Emotion
  plugins: [
    resolve(), // Resolves node modules
    commonjs(), // Converts CommonJS modules to ES6
    typescript(), // Handles TypeScript compilation
    babel({
      babelHelpers: "bundled",
      exclude: /node_modules/,
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: ["@emotion"],
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    terser(), // Minify the output
  ],
};
