import { ReviewPayload } from "@/lib/types";
import { apiClient } from "./client";

export const addReview = async (data: ReviewPayload) => {
	console.log(data);
	const res = await apiClient.post("/api/review", data);
	return res.data;
};
