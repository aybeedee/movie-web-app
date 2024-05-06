import jwt from "jsonwebtoken";

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
