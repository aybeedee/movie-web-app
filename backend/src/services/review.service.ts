import { Op } from "sequelize";
import { Review } from "../models";
import { ReviewData } from "../utils/validations";

export class ReviewService {
	static createReview = async (reviewData: ReviewData, userId: string) => {
		return await Review.create({
			userId: userId,
			movieId: reviewData.movieId,
			comment: reviewData.comment,
			rating: reviewData.rating,
		});
	};

	static getReviewById = async (userId: string, movieId: string) => {
		return await Review.findOne({
			where: {
				[Op.and]: {
					userId: userId,
					movieId: movieId,
				},
			},
		});
	};

	static deleteReview = async (userId: string, movieId: string) => {
		return await Review.destroy({
			where: {
				userId: userId,
				movieId: movieId,
			},
		});
	};
}
