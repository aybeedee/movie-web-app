import { GetRequest } from "@/lib/types";
import { apiClient } from "./client";

export const GET = async (request: GetRequest) => {
	const { url, params } = request;
	const response = await apiClient.get(url, { params });
	return response.data;
};
