import { defineConfig } from "tsup";

export default defineConfig({
    entry: [
        "src/index.ts",
        "src/testing/vitest.ts",
        "src/testing/jest.ts",
        "src/testing/bun.ts",
        "src/testing/chai.ts"
    ],
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: true,
    target: "es2022",
    external: ["vitest", "@jest/globals", "bun:test", "chai"]
});
