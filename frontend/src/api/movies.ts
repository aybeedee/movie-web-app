import { Movie } from "@/lib/types";
import { apiClient } from "./client";

export const getFeaturedMovies = async () => {
	const res = await apiClient.get<Movie[]>("/api/movie?type=featured");
	return res.data;
};

export const getAllRankedMovies = async () => {
	const res = await apiClient.get<Movie[]>("/api/movie?type=ranked");
	return res.data;
};

export const getNewMovies = async () => {
	const res = await apiClient.get<Movie[]>("/api/movie?type=new");
	return res.data;
};
