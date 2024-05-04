import { Request, Response } from "express";
import { signUpService } from "../services/auth.service";

export const signUp = async (req: Request, res: Response) => {
	const data = await signUpService();
	res.send(data);
};
