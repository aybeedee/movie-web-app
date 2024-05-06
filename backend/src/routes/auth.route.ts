import express, { Router } from "express";
import { getUser, login, signUp } from "../controllers/auth.controller";
import { verify } from "../middleware/verify";

const router: Router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/get-user").get(verify, getUser);

export { router as authRouter };
