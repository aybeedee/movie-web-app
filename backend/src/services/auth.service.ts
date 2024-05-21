import { User } from "../models";
import bcrypt from "bcryptjs";
import { generateJwtToken } from "../utils/generateJwtToken";
import { SignupData } from "../utils/validations";

export class AuthService {
	static createUser = async (signupData: SignupData) => {
		const salt = await bcrypt.genSalt(10);
		const encryptedPassword = await bcrypt.hash(signupData.password, salt);

		return await User.create({
			firstName: signupData.firstName,
			lastName: signupData.lastName,
			email: signupData.email,
			password: encryptedPassword,
		});
	};

	static getUserById = async (userId: string) => {
		return await User.findByPk(userId);
	};

	static getUserByEmail = async (email: string, withPassword = false) => {
		if (withPassword) {
			return await User.scope("withPassword").findOne({
				where: { email: email },
			});
		}
		return await User.findOne({
			where: { email: email },
		});
	};

	static verifyPassword = async (
		passwordInput: string,
		userPassword: string
	) => {
		return await bcrypt.compare(passwordInput, userPassword);
	};

	static getToken = (userId: string) => {
		return generateJwtToken(userId);
	};
}
