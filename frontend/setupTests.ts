import "@testing-library/jest-dom";
jest.mock("@/lib/constants", () => ({
	BACKEND_URL: "http://localhost:3000",
}));
