import { Request, Response } from "express";
import { MovieData } from "../utils/validations";
import { validate } from "class-validator";
import { Movie } from "../models";
import { getRandomTrailerUrl } from "../utils/getRandomTrailerUrl";

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
		const posterUrl = `https://picsum.photos/seed/
    ${movieData.title.replace(/[^a-zA-Z0-9]/g, "")}
    /500/750`;

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
