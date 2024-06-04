import { GetRequest, PostRequest } from "@/lib/types";
import { apiClient } from "./client";

export const GET = async (request: GetRequest) => {
	const { url, params } = request;
	const response = await apiClient.get(url, { params });
	return response.data;
};

export const POST = async <T>(request: PostRequest<T>) => {
	const { url, data } = request;
	const response = await apiClient.post(url, data);
	return response.data;
};
