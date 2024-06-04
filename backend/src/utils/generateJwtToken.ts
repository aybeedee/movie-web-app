import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig";

export const generateJwtToken = (id: string) => {
	return jwt.sign(
		{
			user: {
				id: id,
			},
		},
		envConfig.JWT_SECRET!,
		{
			expiresIn: envConfig.JWT_EXPIRES_IN,
		}
	);
};
