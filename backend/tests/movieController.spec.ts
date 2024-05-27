import { Request, Response } from "express";
import { MovieController } from "../src/controllers/movie.controller";
import { MovieService } from "../src/services/movie.service";
import { validate } from "class-validator";

jest.mock("../src/services/movie.service");
jest.mock("class-validator");

describe("MovieController", () => {
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

	describe("addMovie", () => {
		it("should return 400 if input is invalid", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([
				{ message: "Invalid input" },
			]);
			req.body = {};
			await MovieController.addMovie(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				error: true,
				message: "Invalid input",
				data: [{ message: "Invalid input" }],
			});
		});

		it("should return 400 if movie already exists", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([]);
			(MovieService.getMovieByTitle as jest.Mock).mockResolvedValueOnce({});
			req.body = { title: "Existing Movie" };
			await MovieController.addMovie(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				error: true,
				message: "A movie with this title already exists",
			});
		});

		it("should return 201 and movie data if addMovie is successful", async () => {
			const newMovie = {
				id: 1,
				title: "New Movie",
				description: "Description",
				releaseYear: 2024,
				durationHours: 2,
				durationMinutes: 30,
				reviewCount: 0,
				posterUrl: "",
				trailerUrl: "",
			};
			(validate as jest.Mock).mockResolvedValueOnce([]);
			(MovieService.getMovieByTitle as jest.Mock).mockResolvedValueOnce(null);
			(MovieService.createMovie as jest.Mock).mockResolvedValueOnce(newMovie);
			req.body = { title: "New Movie", userId: 1 };
			await MovieController.addMovie(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(201);
			expect(jsonMock).toHaveBeenCalledWith({
				error: false,
				message: "Movie successfully added",
				data: { movie: newMovie },
			});
		});
	});

	describe("deleteMovie", () => {
		it("should return 400 if movie is invalid", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([
				{ message: "Invalid movie" },
			]);
			req.params = { movieId: "1" };
			await MovieController.deleteMovie(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				error: true,
				message: "Invalid movie",
				data: [{ message: "Invalid movie" }],
			});
		});

		it("should return 400 if movie does not exist", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([]);
			(MovieService.deleteMovie as jest.Mock).mockResolvedValueOnce(0);
			req.params = { movieId: "1" };
			req.body = { userId: 1 };
			await MovieController.deleteMovie(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				error: true,
				message: "Movie does not exist",
			});
		});

		it("should return 200 and deletion count if delete is successful", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([]);
			(MovieService.deleteMovie as jest.Mock).mockResolvedValueOnce(1);
			req.params = { movieId: "1" };
			req.body = { userId: 1 };
			await MovieController.deleteMovie(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				error: false,
				message: "Movie successfully deleted",
				data: { count: 1 },
			});
		});
	});

	describe("getMovies", () => {
		it("should return 400 if query is invalid", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([
				{ message: "Invalid query" },
			]);
			req.query = { type: "invalid" };
			await MovieController.getMovies(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				error: true,
				message: "Invalid query",
				data: [{ message: "Invalid query" }],
			});
		});

		it("should return 200 and all movies if no query", async () => {
			const allMovies = [
				{ id: 1, title: "Movie 1" },
				{ id: 2, title: "Movie 2" },
			];
			(MovieService.getAllMovies as jest.Mock).mockResolvedValueOnce(allMovies);
			req.query = {};
			await MovieController.getMovies(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				error: false,
				message: "All movies successfully fetched",
				data: { movies: allMovies },
			});
		});

		it("should return 200 and featured movies if query type is featured", async () => {
			const featuredMovies = [{ id: 1, title: "Featured Movie" }];
			(validate as jest.Mock).mockResolvedValueOnce([]);
			(MovieService.getFeaturedMovies as jest.Mock).mockResolvedValueOnce(
				featuredMovies
			);
			req.query = { type: "featured" };
			await MovieController.getMovies(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				error: false,
				message: "Featured movies successfully fetched",
				data: { movies: featuredMovies },
			});
		});

		// Additional tests for 'ranked' and 'new' types can follow the same pattern
	});

	describe("getMovieById", () => {
		it("should return 400 if movie is invalid", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([
				{ message: "Invalid movie" },
			]);
			req.params = { movieId: "1" };
			await MovieController.getMovieById(req as Request, res as Response);
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
			await MovieController.getMovieById(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				error: true,
				message: "Movie does not exist",
			});
		});

		it("should return 200 and movie data if movie is found", async () => {
			const movie = { id: 1, title: "Existing Movie" };
			const rank = 5;
			const reviews = [{ id: 1, content: "Great movie!" }];
			(validate as jest.Mock).mockResolvedValueOnce([]);
			(MovieService.getMovieById as jest.Mock).mockResolvedValueOnce(movie);
			(MovieService.getMovieRank as jest.Mock).mockResolvedValueOnce(rank);
			(MovieService.getMovieReviews as jest.Mock).mockResolvedValueOnce(
				reviews
			);
			req.params = { movieId: "1" };
			await MovieController.getMovieById(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				error: false,
				message: "Movie successfully fetched",
				data: { movie, rank, reviews },
			});
		});
	});

	describe("searchMovies", () => {
		it("should return 400 if query is invalid", async () => {
			(validate as jest.Mock).mockResolvedValueOnce([
				{ message: "Invalid query" },
			]);
			req.query = { query: "" };
			await MovieController.searchMovies(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(400);
			expect(jsonMock).toHaveBeenCalledWith({
				error: true,
				message: "Invalid query",
				data: [{ message: "Invalid query" }],
			});
		});

		it("should return 200 and movies if search is successful", async () => {
			const movies = [{ id: 1, title: "Matching Movie" }];
			(validate as jest.Mock).mockResolvedValueOnce([]);
			(MovieService.findMoviesByTitle as jest.Mock).mockResolvedValueOnce(
				movies
			);
			req.query = { query: "Matching" };
			await MovieController.searchMovies(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				error: false,
				message: "New movies successfully fetched",
				data: { movies },
			});
		});
	});

	describe("getMoviesByUser", () => {
		it("should return 200 and user movies if request is successful", async () => {
			const movies = [{ id: 1, title: "User Movie" }];
			(MovieService.findMoviesByUser as jest.Mock).mockResolvedValueOnce(
				movies
			);
			req.body = { userId: 1 };
			await MovieController.getMoviesByUser(req as Request, res as Response);
			expect(statusMock).toHaveBeenCalledWith(200);
			expect(jsonMock).toHaveBeenCalledWith({
				error: false,
				message: "User's movies successfully fetched",
				data: { movies },
			});
		});
	});
});
