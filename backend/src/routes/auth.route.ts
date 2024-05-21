import express, { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { verify } from "../middleware/verify";

const router: Router = express.Router();

router.route("/signup").post(AuthController.signUp);
router.route("/login").post(AuthController.login);
router.route("/user").get(verify, AuthController.getUser);

export { router as authRouter };
