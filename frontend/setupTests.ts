import "@testing-library/jest-dom";
jest.mock("@/lib/envConfig", () => ({
	BACKEND_URL: "http://localhost:3000",
}));
