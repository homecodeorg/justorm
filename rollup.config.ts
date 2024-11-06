import { nodeResolve } from '@rollup/plugin-node-resolve';
import buble from '@rollup/plugin-buble';
import { uglify } from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript2'; // import the plugin
import optimizeJs from 'rollup-plugin-optimize-js';

const isProduction = !process.env.ROLLUP_WATCH && !process.env.DEVELOPMENT;
const plugins = [
  nodeResolve(),
  typescript({ tsconfig: './tsconfig.json', check: isProduction }),
];

if (isProduction) {
  plugins.push(
    buble(),
    uglify({
      compress: {
        negate_iife: false, // not required, similar optimization
        passes: 2,
      },
      output: {
        beautify: false,
      },
    }),
    optimizeJs() // occurs after uglify
  );
}

export default [
  {
    input: 'src/index.ts',
    output: {
      // file: 'index.js',
      dir: 'dist/esm',
      format: 'esm',
      // name: 'justorm',
      // globals: {
      //   compare: 'compareq', // tell Rollup that `compareq` is a global variable
      // },
      sourcemap: !isProduction,
      preserveModules: true,
    },
    external: ['compareq'],
    plugins,
  },
  {
    input: 'src/plugins/react.ts',
    output: {
      // file: 'dist/react.js',
      dir: 'dist/esm',
      format: 'esm',
      // name: 'justorm',
      sourcemap: !isProduction,
      preserveModules: true,
    },
    external: ['compareq', 'react'],
    plugins,
  },
  {
    input: 'src/plugins/preact.ts',
    output: {
      // file: 'dist/preact.js',
      dir: 'dist/esm',
      format: 'esm',
      // name: 'justorm',
      sourcemap: !isProduction,
      preserveModules: true,
    },
    external: ['compareq', 'preact'],
    plugins,
  },
];
