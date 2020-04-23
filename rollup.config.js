import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import globals from 'rollup-plugin-node-globals';
export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: [...Object.keys(pkg.dependencies || {})],
  plugins: [globals(), nodePolyfills(), typescript(), terser()],
};
