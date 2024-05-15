import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verify = (req: Request, res: Response, next: NextFunction) => {
	let jwtToken = "";
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		jwtToken = req.headers.authorization.split(" ")[1];
	}

	if (!jwtToken) {
		return res.status(401).json({
			error: true,
			message: "User authorization failed",
		});
	}

	try {
		jwt.verify(jwtToken, process.env.JWT_SECRET!, (error, result) => {
			if (error) {
				return res.status(401).json({
					error: true,
					message: "User authorization failed",
				});
			}

			req.body.userId = (result as JwtPayload).user.id;
			return next();
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: true,
			message: "Internal server error",
		});
	}
};
