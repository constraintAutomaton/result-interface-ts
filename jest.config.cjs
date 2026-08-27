module.exports = {
    testMatch: ["**/test/**/*.jest.test.ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    transform: { "^.+\\.ts$": "@swc/jest" },
    collectCoverage: true,
    coverageProvider: "v8",
    collectCoverageFrom: ["src/testing/matchers.ts", "src/testing/jest.ts"],
    coverageThreshold: {
        global: { branches: 100, functions: 100, lines: 100, statements: 100 }
    }
};
