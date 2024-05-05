import { sequelize } from "../config/db";
import { initModels } from "./init-models";

export const models = initModels(sequelize);
