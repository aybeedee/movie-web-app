import { Request, Response } from "express";
import {
	MovieData,
	MovieIdData,
	MovieQueryData,
	MovieTypeData,
} from "../utils/validations";
import { validate } from "class-validator";
import { MovieService } from "../services/movie.service";

export class MovieController {
	/**
	 * validate inputs, err if invalid |
	 * check if title is unique, err if isn't |
	 * generate random/seeded poster and trailer url |
	 * get user id from req.body.userId |
	 * create movie, return movie |
	 */
	static addMovie = async (req: Request, res: Response) => {
		try {
			const movieData: MovieData = new MovieData();
			movieData.title = req.body.title;
			movieData.description = req.body.description;
			movieData.releaseYear = req.body.releaseYear;
			movieData.durationHours = req.body.durationHours;
			movieData.durationMinutes = req.body.durationMinutes;

			const errors = await validate(movieData);
			if (errors.length > 0) {
				return res.status(400).json({
					error: true,
					message: "Invalid input",
					data: errors,
				});
			}

			const movie = await MovieService.getMovieByTitle(movieData.title);

			if (movie) {
				return res.status(400).json({
					error: true,
					message: "A movie with this title already exists",
				});
			}

			const newMovie = await MovieService.createMovie(
				movieData,
				req.body.userId
			);

			return res.status(201).json({
				error: false,
				message: "Movie successfully added",
				data: {
					movie: {
						id: newMovie.id,
						title: newMovie.title,
						description: newMovie.description,
						releaseYear: newMovie.releaseYear,
						durationHours: newMovie.durationHours,
						durationMinutes: newMovie.durationMinutes,
						reviewCount: newMovie.reviewCount,
						posterUrl: newMovie.posterUrl,
						trailerUrl: newMovie.trailerUrl,
					},
				},
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				error: true,
				message: "Internal server error",
			});
		}
	};

	/**
	 * get movieId from req params |
	 * get user id from req.body.userId |
	 * delete movie, err if doesn't exist |
	 */
	static deleteMovie = async (req: Request, res: Response) => {
		try {
			const movieIdData: MovieIdData = new MovieIdData();
			movieIdData.movieId = req.params.movieId;

			const errors = await validate(movieIdData);

			if (errors.length > 0) {
				return res.status(400).json({
					error: true,
					message: "Invalid movie",
					data: errors,
				});
			}

			const deleteCount = await MovieService.deleteMovie(
				movieIdData.movieId,
				req.body.userId
			);

			if (deleteCount === 0) {
				return res.status(400).json({
					error: true,
					message: "Movie does not exist",
				});
			}

			return res.status(200).json({
				error: false,
				message: "Movie successfully deleted",
				data: {
					count: deleteCount,
				},
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				error: true,
				message: "Internal server error",
			});
		}
	};

	// extract req.query - query params/string
	// if all null, just retrieve all and return
	// if type === featured, return 5 random
	// if type === ranked, return all sorted by reviews
	// if type === new, return 5 sorted by created_at
	/**
	 * get movieId from req params |
	 * get user id from req.body.userId |
	 * delete movie, err if doesn't exist |
	 */
	static getMovies = async (req: Request, res: Response) => {
		try {
			// if query string available, validate input, return records according to type
			if (Object.keys(req.query).length) {
				const movieTypeData: MovieTypeData = new MovieTypeData();
				movieTypeData.type = req.query.type as string;

				const errors = await validate(movieTypeData);

				if (errors.length > 0) {
					return res.status(400).json({
						error: true,
						message: "Invalid query",
						data: errors,
					});
				}

				if (movieTypeData.type === "featured") {
					const featuredMovies = await MovieService.getFeaturedMovies();

					return res.status(200).json({
						error: false,
						message: "Featured movies successfully fetched",
						data: {
							movies: featuredMovies,
						},
					});
				} else if (movieTypeData.type === "ranked") {
					const rankedMovies = await MovieService.getRankedMovies();

					return res.status(200).json({
						error: false,
						message: "Ranked movies successfully fetched",
						data: {
							movies: rankedMovies,
						},
					});
				} else if (movieTypeData.type === "new") {
					const newMovies = await MovieService.getNewMovies();

					return res.status(200).json({
						error: false,
						message: "New movies successfully fetched",
						data: {
							movies: newMovies,
						},
					});
				} else {
					// I believe this segment will never be reached
					// since the validator has already checked all possible values
					// but still erring just in case an edge case has been missed out
					return res.status(400).json({
						error: true,
						message: "Invalid query",
					});
				}
			} else {
				// if no query string, then simply return all records
				const movies = await MovieService.getAllMovies();

				return res.status(200).json({
					error: false,
					message: "All movies successfully fetched",
					data: {
						movies: movies,
					},
				});
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				error: true,
				message: "Internal server error",
			});
		}
	};

	static getMovieById = async (req: Request, res: Response) => {
		try {
			const movieIdData: MovieIdData = new MovieIdData();
			movieIdData.movieId = req.params.movieId;

			const errors = await validate(movieIdData);

			if (errors.length > 0) {
				return res.status(400).json({
					error: true,
					message: "Invalid movie",
					data: errors,
				});
			}

			const movie = await MovieService.getMovieById(movieIdData.movieId);

			if (!movie) {
				return res.status(400).json({
					error: true,
					message: "Movie does not exist",
				});
			}

			const rank = await MovieService.getMovieRank(movie);

			const reviews = await MovieService.getMovieReviews(movieIdData.movieId);

			return res.status(200).json({
				error: false,
				message: "Movie successfully fetched",
				data: {
					movie: movie,
					rank: rank,
					reviews: reviews,
				},
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				error: true,
				message: "Internal server error",
			});
		}
	};

	static searchMovies = async (req: Request, res: Response) => {
		try {
			const movieQueryData: MovieQueryData = new MovieQueryData();
			movieQueryData.query = req.query.query as string;

			const errors = await validate(movieQueryData);

			if (errors.length > 0) {
				return res.status(400).json({
					error: true,
					message: "Invalid query",
					data: errors,
				});
			}

			const movies = await MovieService.findMoviesByTitle(movieQueryData);

			return res.status(200).json({
				error: false,
				message: "New movies successfully fetched",
				data: {
					movies: movies,
				},
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				error: true,
				message: "Internal server error",
			});
		}
	};

	static getMoviesByUser = async (req: Request, res: Response) => {
		try {
			const movies = await MovieService.findMoviesByUser(req.body.userId);
			return res.status(200).json({
				error: false,
				message: "User's movies successfully fetched",
				data: {
					movies: movies,
				},
			});
		} catch (error) {
			console.error(error);
			return res.status(500).json({
				error: true,
				message: "Internal server error",
			});
		}
	};
}
