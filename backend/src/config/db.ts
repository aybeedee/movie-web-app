import { Sequelize, Options } from "sequelize";
import envConfig from "./envConfig";

const config: Options = {
  database: envConfig.POSTGRES_DATABASE,
  username: envConfig.POSTGRES_USERNAME,
  password: envConfig.POSTGRES_PASSWORD,
  host: envConfig.POSTGRES_HOST,
  port: Number(envConfig.POSTGRES_PORT),
  dialect: "postgres",
  dialectOptions: {
    ssl: envConfig.POSTGRES_SSL_MODE === "require",
  },
};

export const sequelize = new Sequelize(config);
