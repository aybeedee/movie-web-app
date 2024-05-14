import express, { Router } from "express";
import { addMovie } from "../controllers/movie.controller";
import { verify } from "../middleware/verify";

const router: Router = express.Router();

router.route("/add-movie").post(verify, addMovie);

export { router as movieRouter };
