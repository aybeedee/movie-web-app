import { sequelize } from "../config/db";
import { initModels } from "./init-models";

export const { User, Movie } = initModels(sequelize);
