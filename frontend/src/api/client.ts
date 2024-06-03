import envConfig from "@/lib/envConfig";
import axios from "axios";

const getToken = () => {
	let token = null;
	const jwtToken = localStorage.getItem("jwtToken");
	if (jwtToken) {
		try {
			token = JSON.parse(jwtToken);
		} catch (err) {
			token = null;
		}
	}
	return token;
};

export const apiClient = axios.create({
	baseURL: envConfig.BACKEND_URL,
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use((config) => {
	const token = getToken();
	config.headers.Authorization = token ? `Bearer ${token}` : "";
	return config;
});
