import express, { Router } from "express";
import { addReview, editReview } from "../controllers/review.controller";
import { verify } from "../middleware/verify";

const router: Router = express.Router();

router.route("/add-review").post(verify, addReview);
router.route("/edit-review").put(verify, editReview);

export { router as reviewRouter };
