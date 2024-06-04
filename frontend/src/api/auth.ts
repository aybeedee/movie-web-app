import { LoginPayload, SignupPayload } from "@/lib/types";
import { apiClient } from "./client";
import { POST } from "./methods";

export const signup = async (data: SignupPayload) => {
	return await POST({
		url: "/api/auth/signup",
		data,
	});
};

export const login = async (data: LoginPayload) => {
	return await POST({
		url: "/api/auth/login",
		data,
	});
};

export const getUser = async () => {
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
