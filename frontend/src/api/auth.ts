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
	console.log(
		"header in getuser: ",
		apiClient.defaults.headers.common.Authorization
	);
	const res = await apiClient.get("/api/auth/user", {
		// disabling cache for this verification request as the
		// request was being cached and allowing user to be authenticated
		// magically (+ localStorage being regenerated after removal) upon
		// going back in the browser history
		headers: {
			"Cache-Control": "no-cache",
			Pragma: "no-cache",
			Expires: "0",
		},
	});
	return res.data;
};
