import { ReviewPayload } from "@/lib/types";
import { POST, PUT, DELETE } from "./methods";

export const addReview = async (data: ReviewPayload) => {
	return await POST({
		url: "/api/review",
		data,
	});
};

export const editReview = async (data: ReviewPayload) => {
	return await PUT({
		url: "/api/review",
		data,
	});
};

export const deleteReview = async (movieId: string) => {
	return await DELETE({
		url: `/api/review/${movieId}`,
	});
};
