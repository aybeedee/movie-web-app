import { Op } from "sequelize";
import { Movie, Review, User } from "../models";
import { generatePosterUrl } from "../utils/generatePosterUrl";
import { getRandomTrailerUrl } from "../utils/getRandomTrailerUrl";
import { MovieData, MovieQueryData } from "../utils/validations";
import { MovieAttributes } from "../models/movie";

export class MovieService {
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

	static getMovieById = async (movieId: string, withUserId = false) => {
		if (withUserId) {
			return await Movie.scope("withUserId").findByPk(movieId);
		}
		return await Movie.findByPk(movieId);
	};

	static getMovieByTitle = async (title: string) => {
		return await Movie.findOne({ where: { title: title } });
	};

	// compute and return rank
	static getMovieRank = async (movie: MovieAttributes) => {
		// - get all movies sorted by review count (desc)
		const movies = await Movie.findAll({
			order: [["reviewCount", "DESC"]],
			where: {
				id: {
					[Op.ne]: movie.id,
				},
			},
		});

		// - iterate through movies, incrementing rank with each review count group passed
		let rank: number = 0;
		let currentCount: number = -1;
		for (let i = 0; i < movies.length; i++) {
			if (movies[i].reviewCount !== currentCount) {
				rank++;
			}
			if (movies[i].reviewCount <= movie.reviewCount) {
				break;
			}
			currentCount = movies[i].reviewCount;
		}

		return rank;
	};

	static getMovieReviews = async (movieId: string) => {
		return await Review.findAll({
			where: {
				movieId: movieId,
			},
			include: {
				model: User,
				as: "user",
			},
		});
	};

	static deleteMovie = async (movieId: string, userId: string) => {
		return await Movie.destroy({
			where: {
				id: movieId,
				// ensures that the requesting user is the owner
				userId: userId,
			},
		});
	};

	static getAllMovies = async () => {
		return await Movie.findAll();
	};

	// featured returns a random 5 movies for now
	static getFeaturedMovies = async () => {
		const movies = await this.getAllMovies();

		// if total records are less than 5, return all
		if (movies.length < 5) {
			return movies;
		} else {
			// get 5 random indices
			// potential issue: this might slow down the response significantly if movies.length is close to 5
			// update: apparently not, would have to be a very bad random seed for this to choke
			const randomIndices = new Set<number>();
			while (randomIndices.size < 5) {
				randomIndices.add(Math.floor(Math.random() * movies.length));
			}
			return Array.from(randomIndices).map(
				(randomIndex) => movies[randomIndex]
			);
		}
	};

	static getRankedMovies = async () => {
		return await Movie.findAll({
			order: [["reviewCount", "DESC"]],
		});
	};

	static getNewMovies = async () => {
		return await Movie.findAll({
			order: [["createdAt", "DESC"]],
			limit: 5,
		});
	};

	static findMoviesByTitle = async (movieQueryData: MovieQueryData) => {
		return await Movie.findAll({
			where: {
				title: {
					[Op.iLike]: `%${movieQueryData.query}%`,
				},
			},
		});
	};

	static findMoviesByUser = async (userId: string) => {
		return await Movie.findAll({
			where: {
				userId: userId,
			},
			order: [["createdAt", "DESC"]],
		});
	};
}
