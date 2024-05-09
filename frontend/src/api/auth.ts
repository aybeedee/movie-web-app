import { SignupData } from "@/lib/types";
import { apiClient } from "./client";

export const signup = async (data: SignupData) => {
	const res = await apiClient.post("/api/auth/signup", data);
	return res;
};
