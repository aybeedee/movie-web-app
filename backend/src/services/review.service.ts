import { Op } from "sequelize";
import { Movie, Review, User } from "../models";
import { generatePosterUrl } from "../utils/generatePosterUrl";
import { getRandomTrailerUrl } from "../utils/getRandomTrailerUrl";
import { MovieData, MovieIdData, MovieQueryData } from "../utils/validations";
import { MovieAttributes } from "../models/movie";

export class ReviewService {
	static createMovie = async (movieData: MovieData, userId: string) => {
		const posterUrl = generatePosterUrl(movieData.title);
		const trailerUrl = getRandomTrailerUrl();

		return await Movie.create({
			title: movieData.title,
			description: movieData.description,
			releaseYear: movieData.releaseYear,
			durationHours: movieData.durationHours,
			durationMinutes: movieData.durationMinutes,
			posterUrl: posterUrl,
			trailerUrl: trailerUrl,
			userId: userId,
		});
	};

	static getMovieById = async (movieId: string) => {
		return await Movie.findByPk(movieId, {
			attributes: {
				exclude: ["createdAt", "userId"],
			},
		});
	};
}
