import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
});

// Custom Jest configuration
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jest-environment-jsdom", // Use jsdom to simulate a browser-like environment
};

// Export the Jest configuration
export default createJestConfig(config);
