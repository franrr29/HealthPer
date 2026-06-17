const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  testEnvironment: "node",

  setupFiles: [
    "<rootDir>/src/tests/setup.ts"
  ],

  transform: {
    ...tsJestTransformCfg,
  },
};