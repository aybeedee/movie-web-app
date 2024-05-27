import express, { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { verify } from "../middleware/verify";

const router: Router = express.Router();

router.route("/").post(verify, ReviewController.addReview);
router.route("/").put(verify, ReviewController.editReview);
// only need movieId in params
// along with userId from auth header, it forms the composite pk of review
router.route("/:movieId").delete(verify, ReviewController.deleteReview);

export { router as reviewRouter };
