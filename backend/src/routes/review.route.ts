import express, { Router } from "express";
import {
	addReview,
	editReview,
	deleteReview,
} from "../controllers/review.controller";
import { verify } from "../middleware/verify";

const router: Router = express.Router();

router.route("/").post(verify, addReview);
router.route("/").put(verify, editReview);
router.route("/:reviewId").delete(verify, deleteReview);

export { router as reviewRouter };
