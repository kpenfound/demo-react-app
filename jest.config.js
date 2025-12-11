export default {
  testEnvironment: "node",
  injectGlobals: true,
  setupFilesAfterEnv: ["@otel-test-runner/jest-test/register"],
};
