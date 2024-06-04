import dotenv from "dotenv";
dotenv.config();

const envConfig = {
	POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
	POSTGRES_USERNAME: process.env.POSTGRES_USERNAME,
	POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
	POSTGRES_HOST: process.env.POSTGRES_HOST,
	POSTGRES_PORT: process.env.POSTGRES_PORT,
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
	PORT: process.env.PORT,
};

export default envConfig;
