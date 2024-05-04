import express, { Router } from "express";
import { signUp } from "../controllers/auth.controller";

const router: Router = express.Router();

router.route("/signup").post(signUp);

export { router as authRouter };
