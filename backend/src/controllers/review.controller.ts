import { Request, Response } from "express";
import { MovieIdData, ReviewData } from "../utils/validations";
import { validate } from "class-validator";
import { Movie, Review } from "../models";
import { Op } from "sequelize";

// some edge cases for later:
//  - movie does not exist | update: dealt with while implementing review count increment/decrement
//  - a review for the movie from that user already exists
// note: I believe these are already being checked by database constraints but would be nice
// to have appropriate error messages rather than internal server for all such cases ?
/**
 * validate inputs, err if invalid |
 * get movie by pk, err if does not exist |
 * get user id from req.body.userId |
 * create review, increment movie review count, return review |
 */
export const addReview = async (req: Request, res: Response) => {
	try {
		const reviewData: ReviewData = new ReviewData();
		reviewData.movieId = req.body.movieId;
		reviewData.comment = req.body.comment;
		reviewData.rating = req.body.rating;

		const errors = await validate(reviewData);
		if (errors.length > 0) {
			return res.status(400).json({
				error: true,
				message: "Invalid input",
				data: errors,
			});
		}

		const movie = await Movie.findByPk(reviewData.movieId);

		if (!movie) {
			return res.status(400).json({
				error: true,
				message: "Movie does not exist",
			});
		}

		const newReview = await Review.create({
			userId: req.body.userId,
			movieId: reviewData.movieId,
			comment: reviewData.comment,
			rating: reviewData.rating,
		});

		// increment the review count of related movie
		await movie.increment("reviewCount");

		return res.status(201).json({
			error: false,
			message: "Review successfully added",
			data: {
				review: {
					userId: newReview.userId,
					movieId: newReview.movieId,
					comment: newReview.comment,
					rating: newReview.rating,
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
 * validate inputs, err if invalid |
 * get user id from req.body.userId |
 * find review by userId and movieId, err if doesn't exist |
 * set edited true if not already |
 * update review, return review |
 */
export const editReview = async (req: Request, res: Response) => {
	try {
		const editReviewData: ReviewData = new ReviewData();
		editReviewData.movieId = req.body.movieId;
		editReviewData.comment = req.body.comment;
		editReviewData.rating = req.body.rating;

		const errors = await validate(editReviewData);
		if (errors.length > 0) {
			return res.status(400).json({
				error: true,
				message: "Invalid input",
				data: errors,
			});
		}

		const review = await Review.findOne({
			where: {
				[Op.and]: {
					userId: req.body.userId,
					movieId: editReviewData.movieId,
				},
			},
		});

		if (!review) {
			return res.status(400).json({
				error: true,
				message: "Review does not exist",
			});
		}

		// only set edited true once - on the first edit
		if (review.edited) {
			review.set({
				comment: editReviewData.comment,
				rating: editReviewData.rating,
			});
		} else {
			review.set({
				comment: editReviewData.comment,
				rating: editReviewData.rating,
				edited: true,
			});
		}

		await review.save();

		return res.status(200).json({
			error: false,
			message: "Review successfully updated",
			data: {
				review: {
					userId: review.userId,
					movieId: review.movieId,
					comment: review.comment,
					rating: review.rating,
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
 * delete review, err if doesn't exist |
 */
export const deleteReview = async (req: Request, res: Response) => {
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

		const movie = await Movie.findByPk(movieIdData.movieId);

		if (!movie) {
			return res.status(400).json({
				error: true,
				message: "Movie does not exist",
			});
		}

		const deleteCount = await Review.destroy({
			where: {
				movieId: movieIdData.movieId,
				userId: req.body.userId,
			},
		});

		if (deleteCount === 0) {
			return res.status(400).json({
				error: true,
				message: "Review does not exist",
			});
		}

		// decrement the review count of related movie
		// Note: I believe this is a race-free transaction
		// but if race occurs, need to check for reviewCount >= 0
		// update: db is checking that through constraint anyway, no?
		await movie.decrement("reviewCount");

		return res.status(200).json({
			error: false,
			message: "Review successfully deleted",
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
