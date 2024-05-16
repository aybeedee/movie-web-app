import express, { Router } from "express";
import { addMovie, deleteMovie } from "../controllers/movie.controller";
import { verify } from "../middleware/verify";

const router: Router = express.Router();

router.route("/").post(verify, addMovie);
router.route("/:movieId").delete(verify, deleteMovie);

export { router as movieRouter };
