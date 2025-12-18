import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/*.spec.ts"],
    clearMocks: true,
    verbose: true,
    setupFiles: ["<rootDir>/src/app/tests/setup.ts"],
};
export default config;
