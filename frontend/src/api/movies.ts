import { AddMoviePayload, EditMoviePayload } from "@/lib/types";
import { apiClient } from "./client";
import { GET } from "./methods";

export const addMovie = async (data: AddMoviePayload) => {
	const res = await apiClient.post("/api/movie", data);
	return res.data;
};

export const editMovie = async (data: EditMoviePayload) => {
	const res = await apiClient.put("/api/movie", data);
	return res.data;
};

export const getMovieById = async (movieId: string) => {
	return await GET({
		url: `/api/movie/${movieId}`,
	});
};

export const getFeaturedMovies = async () => {
	return await GET({
		url: "/api/movie",
		params: { type: "featured" },
	});
};

export const getAllRankedMovies = async () => {
	return await GET({
		url: "/api/movie",
		params: { type: "ranked" },
	});
};

export const getNewMovies = async () => {
	return await GET({
		url: "/api/movie",
		params: { type: "new" },
	});
};

export const getSearchResults = async (searchQuery: string) => {
	return await GET({
		url: "/api/movie/search",
		params: { query: searchQuery },
	});
};

export const getMoviesByUser = async () => {
	return await GET({
		url: "/api/movie/user",
	});
};

export const deleteMovie = async (movieId: string) => {
	const res = await apiClient.delete(`/api/movie/${movieId}`);
	return res.data;
};
