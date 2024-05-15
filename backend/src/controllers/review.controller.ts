import { Request, Response } from "express";
import { ReviewData } from "../utils/validations";
import { validate } from "class-validator";
import { Review } from "../models";
import { Op } from "sequelize";

/**
 * validate inputs, err if invalid |
 * get user id from req.body.userId |
 * create review, return review |
 */
export const addReview = async (req: Request, res: Response) => {
	try {
		console.log(req.body);
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

		const newReview = await Review.create({
			userId: req.body.userId,
			movieId: reviewData.movieId,
			comment: reviewData.comment,
			rating: reviewData.rating,
		});

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
 * update review, return review |
 */
export const editReview = async (req: Request, res: Response) => {
	try {
		console.log(req.body);
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

		const review = await Review.findOne({
			where: {
				[Op.and]: {
					userId: req.body.userId,
					movieId: reviewData.movieId,
				},
			},
		});

		if (!review) {
			return res.status(400).json({
				error: true,
				message: "Review does not exist",
			});
		}

		review.set({
			comment: reviewData.comment,
			rating: reviewData.rating,
		});

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
