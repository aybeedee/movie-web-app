import express from "express";
import { authRouter } from "./auth.route";
import { movieRouter } from "./movie.route";
import { reviewRouter } from "./review.route";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/movie", movieRouter);
router.use("/review", reviewRouter);

export { router as routes };
