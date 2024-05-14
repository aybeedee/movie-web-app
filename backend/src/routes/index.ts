import express from "express";
import { authRouter } from "./auth.route";
import { movieRouter } from "./movie.route";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/movie", movieRouter);

export { router as routes };
