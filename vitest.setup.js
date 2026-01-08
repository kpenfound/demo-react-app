// vitest.setup.js
import { test, describe } from "vitest";

import {
  instrumentVitestTestFn,
  instrumentVitestDescribeFn,
} from "@otel-test-runner/vitest-otel";
import { sdk } from "@otel-test-runner/vitest-otel";

globalThis.test = instrumentVitestTestFn(test);
globalThis.describe = instrumentVitestDescribeFn(describe);

globalThis.afterAll(async () => {
  await sdk.shutdown();
});
