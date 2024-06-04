import { Sequelize, Options } from "sequelize";
import envConfig from "./envConfig";

const config: Options = {
	database: envConfig.POSTGRES_DATABASE,
	username: envConfig.POSTGRES_USERNAME,
	password: envConfig.POSTGRES_PASSWORD,
	host: envConfig.POSTGRES_HOST,
	port: Number(envConfig.POSTGRES_PORT),
	dialect: "postgres",
};

export const sequelize = new Sequelize(config);
