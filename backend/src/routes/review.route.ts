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
// only need movieId in params
// along with userId from auth header, it forms the composite pk of review
router.route("/:movieId").delete(verify, deleteReview);

export { router as reviewRouter };
