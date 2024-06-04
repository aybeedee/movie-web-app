import {
	GetRequest,
	PostRequest,
	DeleteRequest,
	PutRequest,
} from "@/lib/types";
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

export const DELETE = async (request: DeleteRequest) => {
	const { url } = request;
	const response = await apiClient.delete(url);
	return response.data;
};

export const PUT = async <T>(request: PutRequest<T>) => {
	const { url, data } = request;
	const response = await apiClient.put(url, data);
	return response.data;
};
