import express, { Router } from "express";
import { MovieController } from "../controllers/movie.controller";
import { verify } from "../middleware/verify";

const router: Router = express.Router();

router.route("/").get(MovieController.getMovies);
router.route("/search").get(MovieController.searchMovies);
router.route("/user").get(verify, MovieController.getMoviesByUser);
router.route("/:movieId").get(MovieController.getMovieById);
router.route("/").post(verify, MovieController.addMovie);
router.route("/").put(verify, MovieController.editMovie);
router.route("/:movieId").delete(verify, MovieController.deleteMovie);

export { router as movieRouter };
