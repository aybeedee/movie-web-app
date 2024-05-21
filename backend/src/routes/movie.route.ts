import express, { Router } from "express";
import {
	addMovie,
	deleteMovie,
	getMovies,
	getMovieById,
	searchMovies,
	getMoviesByUser,
} from "../controllers/movie.controller";
import { verify } from "../middleware/verify";

const router: Router = express.Router();

router.route("/").get(getMovies);
router.route("/search").get(searchMovies);
router.route("/user").get(verify, getMoviesByUser);
router.route("/:movieId").get(getMovieById);
router.route("/").post(verify, addMovie);
router.route("/:movieId").delete(verify, deleteMovie);

export { router as movieRouter };
