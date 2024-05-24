/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	roots: ["<rootDir>/src"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	moduleNameMapper: {
		"@/(.*)": "<rootDir>/src/$1",
	},
	setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
};
