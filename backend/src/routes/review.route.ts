import express, { Router } from "express";
import { addReview } from "../controllers/review.controller";
import { verify } from "../middleware/verify";

const router: Router = express.Router();

router.route("/add-review").post(verify, addReview);

export { router as reviewRouter };
