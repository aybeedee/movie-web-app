import { apiClient } from "./client";

export const getFeaturedMovies = async () => {
	const res = await apiClient.get("/api/movie?type=featured");
	return res.data;
};

export const getAllRankedMovies = async () => {
	const res = await apiClient.get("/api/movie?type=ranked");
	return res.data;
};

export const getNewMovies = async () => {
	const res = await apiClient.get("/api/movie?type=new");
	return res.data;
};

export const getSearchResults = async (searchQuery: string) => {
	const res = await apiClient.get(`/api/movie/search?query=${searchQuery}`);
	return res.data;
};
