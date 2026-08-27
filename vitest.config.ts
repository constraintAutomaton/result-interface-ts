import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["test/**/*.vitest.test.ts"],
        coverage: {
            enabled: true,
            provider: "v8",
            include: ["src/testing/matchers.ts", "src/testing/vitest.ts"],
            thresholds: { 100: true }
        }
    }
});
