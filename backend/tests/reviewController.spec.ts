import { Request, Response } from "express";
import { ReviewController } from "../src/controllers/review.controller";
import { MovieService } from "../src/services/movie.service";
import { ReviewService } from "../src/services/review.service";
import { validate } from "class-validator";

jest.mock("../src/services/movie.service");
jest.mock("../src/services/review.service");
jest.mock("class-validator");

describe("ReviewController", () => {
	let req: Partial<Request>;
	let res: Partial<Response>;
	let statusMock: jest.Mock;
	let jsonMock: jest.Mock;

	beforeEach(() => {
		req = {};
		res = {
			status: jest.fn(),
			json: jest.fn(),
		};
		statusMock = jest.fn(() => res);
		jsonMock = jest.fn();
		res.status = statusMock;
		res.json = jsonMock;
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe("addReview", () => {
		it("should return 400 if input is invalid", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([
				{ message: "Invalid input" },
			]);
			req.body = {};
			await ReviewController.addReview(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				error: true,
				message: "Invalid input",
				data: [{ message: "Invalid input" }],
			});
		});

		it("should return 400 if movie does not exist", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([]);
			(MovieService.getMovieById as jest.Mock).mockResolvedValueOnce(null);
			req.body = { movieId: 1 };
			await ReviewController.addReview(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				error: true,
				message: "Movie does not exist",
			});
		});

		it("should return 201 and review data if addReview is successful", async () => {
			const newReview = {
				userId: 1,
				movieId: 1,
				comment: "Great movie",
				rating: 5,
			};
			(validate as jest.Mock).mockResolvedValueOnce([]);
			(MovieService.getMovieById as jest.Mock).mockResolvedValueOnce({
				increment: jest.fn(),
			});
			(ReviewService.createReview as jest.Mock).mockResolvedValueOnce(
				newReview
			);
			req.body = { movieId: 1, comment: "Great movie", rating: 5, userId: 1 };
			await ReviewController.addReview(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(201);
			expect(jsonMock).toHaveBeenCalledWith({
				error: false,
				message: "Review successfully added",
				data: { review: newReview },
			});
		});
	});

	describe("editReview", () => {
		it("should return 400 if input is invalid", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([
				{ message: "Invalid input" },
			]);
			req.body = {};
			await ReviewController.editReview(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				error: true,
				message: "Invalid input",
				data: [{ message: "Invalid input" }],
			});
		});

		it("should return 400 if review does not exist", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([]);
			(ReviewService.getReviewById as jest.Mock).mockResolvedValueOnce(null);
			req.body = { movieId: 1, userId: 1 };
			await ReviewController.editReview(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				error: true,
				message: "Review does not exist",
			});
		});

		it("should return 200 and updated review data if editReview is successful", async () => {
			const existingReview = {
				userId: 1,
				movieId: 1,
				comment: "Great movie",
				rating: 5,
				edited: false,
				set: jest.fn(({ comment, rating, edited }) => {
					existingReview.comment = comment;
					existingReview.rating = rating;
					existingReview.edited = edited ? edited : existingReview.edited;
				}),
				save: jest.fn(),
			};
			(validate as jest.Mock).mockResolvedValueOnce([]);
			(ReviewService.getReviewById as jest.Mock).mockResolvedValueOnce(
				existingReview
			);
			req.body = {
				movieId: 1,
				comment: "Updated comment",
				rating: 4,
				userId: 1,
			};
			await ReviewController.editReview(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				error: false,
				message: "Review successfully updated",
				data: {
					review: {
						userId: existingReview.userId,
						movieId: existingReview.movieId,
						comment: "Updated comment",
						rating: 4,
					},
				},
			});
		});
	});

	describe("deleteReview", () => {
		it("should return 400 if movie is invalid", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([
				{ message: "Invalid movie" },
			]);
			req.params = { movieId: "1" };
			await ReviewController.deleteReview(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				error: true,
				message: "Invalid movie",
				data: [{ message: "Invalid movie" }],
			});
		});

		it("should return 400 if movie does not exist", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([]);
			(MovieService.getMovieById as jest.Mock).mockResolvedValueOnce(null);
			req.params = { movieId: "1" };
			req.body = { userId: 1 };
			await ReviewController.deleteReview(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				error: true,
				message: "Movie does not exist",
			});
		});

		it("should return 400 if review does not exist", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([]);
			(MovieService.getMovieById as jest.Mock).mockResolvedValueOnce({});
			(ReviewService.deleteReview as jest.Mock).mockResolvedValueOnce(0);
			req.params = { movieId: "1" };
			req.body = { userId: 1 };
			await ReviewController.deleteReview(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				error: true,
				message: "Review does not exist",
			});
		});

		it("should return 200 and deletion count if delete is successful", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([]);
			(MovieService.getMovieById as jest.Mock).mockResolvedValueOnce({
				decrement: jest.fn(),
			});
			(ReviewService.deleteReview as jest.Mock).mockResolvedValueOnce(1);
			req.params = { movieId: "1" };
			req.body = { userId: 1 };
			await ReviewController.deleteReview(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				error: false,
				message: "Review successfully deleted",
				data: { count: 1 },
			});
		});
	});
});
