import { Request, Response } from "express";
import {
	MovieData,
	MovieIdData,
	MovieQueryData,
	MovieTypeData,
} from "../utils/validations";
import { validate } from "class-validator";
import { Movie, Review, User } from "../models";
import { getRandomTrailerUrl } from "../utils/getRandomTrailerUrl";
import { Op } from "sequelize";

/**
 * validate inputs, err if invalid |
 * check if title is unique, err if isn't |
 * generate random/seeded poster and trailer url |
 * get user id from req.body.userId |
 * create movie, return movie |
 */
export const addMovie = async (req: Request, res: Response) => {
	try {
		console.log(req.body);
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

		const movie = await Movie.findOne({ where: { title: movieData.title } });

		if (movie) {
			return res.status(400).json({
				error: true,
				message: "A movie with this title already exists",
			});
		}

		// seeding with movie title (which is always unique in implementation)
		// although copmressing title to only alphanumeric may potentially cause collisions with particularly similar titles
		const posterUrl = `https://picsum.photos/seed/${movieData.title.replace(
			/[^a-zA-Z0-9]/g,
			""
		)}/500/750`;

		const trailerUrl = getRandomTrailerUrl();

		const newMovie = await Movie.create({
			title: movieData.title,
			description: movieData.description,
			releaseYear: movieData.releaseYear,
			durationHours: movieData.durationHours,
			durationMinutes: movieData.durationMinutes,
			posterUrl: posterUrl,
			trailerUrl: trailerUrl,
			userId: req.body.userId,
		});

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
					createdAt: newMovie.createdAt,
					userId: newMovie.userId,
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
export const deleteMovie = async (req: Request, res: Response) => {
	try {
		console.log(req.params.movieId);

		const movieIdData: MovieIdData = new MovieIdData();
		movieIdData.movieId = req.params.movieId;

		const errors = await validate(movieIdData);

		if (errors.length > 0) {
			return res.status(400).json({
				error: true,
				message: "Invalid input",
				data: errors,
			});
		}

		const deleteCount = await Movie.destroy({
			where: {
				id: movieIdData.movieId,
				// ensures that the requesting user is the owner
				userId: req.body.userId,
			},
		});

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
export const getMovies = async (req: Request, res: Response) => {
	try {
		console.log("req.params: ", req.params);
		console.log("req.query: ", req.query);
		console.log("req.query.type: ", req.query.type);

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
				// the idea is to return a random 5 movies for now
				const movies = await Movie.findAll({
					attributes: {
						exclude: ["createdAt", "userId"],
					},
				});

				// if total records are less than 5, return all
				if (movies.length < 5) {
					return res.status(200).json({
						error: false,
						message: "Featured movies successfully fetched",
						data: {
							movies: movies,
						},
					});
				} else {
					// get 5 random indices
					// potential issue: this might slow down the response significantly if movies.length is close to 5
					// update: apparently not, would have to be a very bad random seed for this to choke
					const randomIndices = new Set<number>();
					while (randomIndices.size < 5) {
						randomIndices.add(Math.floor(Math.random() * movies.length));
					}

					return res.status(200).json({
						error: false,
						message: "Featured movies successfully fetched",
						data: {
							movies: Array.from(randomIndices).map(
								(randomIndex) => movies[randomIndex]
							),
						},
					});
				}
			} else if (movieTypeData.type === "ranked") {
				const movies = await Movie.findAll({
					attributes: {
						exclude: ["createdAt", "userId"],
					},
					order: [["reviewCount", "DESC"]],
				});

				return res.status(200).json({
					error: false,
					message: "Ranked movies successfully fetched",
					data: {
						movies: movies,
					},
				});
			} else if (movieTypeData.type === "new") {
				const movies = await Movie.findAll({
					attributes: {
						exclude: ["createdAt", "userId"],
					},
					order: [["createdAt", "DESC"]],
					limit: 5,
				});

				return res.status(200).json({
					error: false,
					message: "New movies successfully fetched",
					data: {
						movies: movies,
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
			const movies = await Movie.findAll({
				attributes: {
					exclude: ["createdAt", "userId"],
				},
			});

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

export const getMovieById = async (req: Request, res: Response) => {
	try {
		console.log("req.params: ", req.params);

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

		const movie = await Movie.findByPk(movieIdData.movieId);

		if (!movie) {
			return res.status(400).json({
				error: true,
				message: "Movie does not exist",
			});
		}

		// compute rank

		// - get all movies sorted by review count (desc)
		const movies = await Movie.findAll({
			attributes: {
				exclude: ["createdAt", "userId"],
			},
			order: [["reviewCount", "DESC"]],
			where: {
				id: {
					[Op.ne]: movieIdData.movieId,
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

		// find all reviews of the movie
		const reviews = await Review.findAll({
			where: {
				movieId: movieIdData.movieId,
			},
			include: {
				model: User,
				as: "user",
			},
		});

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

export const searchMovies = async (req: Request, res: Response) => {
	try {
		console.log("req.query: ", req.query);
		console.log("req.query.type: ", req.query.query);

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

		const movies = await Movie.findAll({
			attributes: {
				exclude: ["createdAt", "userId"],
			},
			where: {
				title: {
					[Op.iLike]: `%${movieQueryData.query}%`,
				},
			},
		});

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

export const getMoviesByUser = async (req: Request, res: Response) => {
	try {
		const movies = await Movie.findAll({
			attributes: {
				exclude: ["createdAt", "userId"],
			},
			where: {
				userId: req.body.userId,
			},
			order: [["createdAt", "DESC"]],
		});

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
