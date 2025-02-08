import preset from 'ts-jest/presets/index.js';

/** @type {import('ts-jest').JestConfigWithTsJest} */
const jestConfig = {
  ...preset.defaults,
  transform: {
    ...preset.defaults.transform,
    // '^.+.jsx?$': 'babel-jest', // Adding support for JavaScript files
    '^.+.tsx?$': ['ts-jest', { useESM: true }], // ts-jest configuration
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // Treat TypeScript files as ESM
  silent: false,
};

export default jestConfig;
