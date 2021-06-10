import { nodeResolve } from '@rollup/plugin-node-resolve';
import buble from 'rollup-plugin-buble';
import { uglify } from 'rollup-plugin-uglify';
import optimizeJs from 'rollup-plugin-optimize-js';

const isProduction = !process.env.ROLLUP_WATCH && !process.env.DEVELOPMENT;
const plugins = [nodeResolve()];

if (isProduction) {
  plugins.push(
    buble(),
    uglify({
      compress: {
        negate_iife: false, // not required, similar optimization
        // omitted for brevity
      },
    }),
    optimizeJs() // occurs after uglify
  );
}

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'index.js',
      format: 'umd',
      name: 'justorm',
    },
    external: ['compareq'],
    plugins,
  },
  {
    input: 'src/plugins/react.js',
    output: {
      file: 'react.js',
      format: 'umd',
      name: 'justorm',
    },
    external: ['compareq', 'react'],
    plugins,
  },
  {
    input: 'src/plugins/preact.js',
    output: {
      file: 'preact.js',
      format: 'umd',
      name: 'justorm',
    },
    external: ['compareq', 'preact'],
    plugins,
  },
];
