import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";

const dev = process.env.ROLLUP_WATCH;

const plugins = [
  nodeResolve(),
    commonjs(),
  typescript(),
  json(),
  !dev &&
    babel({
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              esmodules: true,
            },
          },
        ],
      ],
    }),
  !dev && terser(),
];

export default [
  {
    input: "src/install-button.ts",
    output: {
      dir: "dist",
      format: "es",
    },
    plugins,
  },
];
