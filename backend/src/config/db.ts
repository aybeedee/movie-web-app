import { Sequelize, Options } from "sequelize";

const config: Options = {
	database: process.env.POSTGRES_DATABASE,
	username: process.env.POSTGRES_USERNAME,
	password: process.env.POSTGRES_PASSWORD,
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_PORT),
	dialect: "postgres",
};

export const sequelize = new Sequelize(config);
