import { AddMoviePayload, EditMoviePayload } from "@/lib/types";
import { GET, POST, PUT, DELETE } from "./methods";

export const addMovie = async (data: AddMoviePayload) => {
	return await POST({
		url: "/api/movie",
		data,
	});
};

export const editMovie = async (data: EditMoviePayload) => {
	return await PUT({
		url: "/api/movie",
		data,
	});
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
	return await DELETE({
		url: `/api/movie/${movieId}`,
	});
};
