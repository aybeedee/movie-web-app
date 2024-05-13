import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateJwtToken = (id: string) => {
	return jwt.sign(
		{
			user: {
				id: id,
			},
		},
		process.env.JWT_SECRET!,
		{
			expiresIn: process.env.JWT_EXPIRES_IN,
		}
	);
};
