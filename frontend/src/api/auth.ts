import { LoginData, SignupData } from "@/lib/types";
import { apiClient } from "./client";

export const signup = async (data: SignupData) => {
	const res = await apiClient.post("/api/auth/signup", data);
	return res.data;
};

export const login = async (data: LoginData) => {
	const res = await apiClient.post("/api/auth/login", data);
	return res.data;
};

export const getUser = async () => {
	const res = await apiClient.get("/api/auth/get-user");
	return res.data;
};
