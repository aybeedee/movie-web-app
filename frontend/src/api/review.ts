import { ReviewPayload } from "@/lib/types";
import { apiClient } from "./client";
import { DELETE, POST } from "./methods";

export const addReview = async (data: ReviewPayload) => {
	return await POST({
		url: "/api/review",
		data,
	});
};

export const editReview = async (data: ReviewPayload) => {
	const res = await apiClient.put("/api/review", data);
	return res.data;
};

export const deleteReview = async (movieId: string) => {
	return await DELETE({
		url: `/api/review/${movieId}`,
	});
};
