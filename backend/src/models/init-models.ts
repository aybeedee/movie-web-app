import type { Sequelize } from "sequelize";
import { Movie as _Movie } from "./movie";
import type { MovieAttributes, MovieCreationAttributes } from "./movie";
import { User as _User } from "./user";
import type { UserAttributes, UserCreationAttributes } from "./user";

export {
  _Movie as Movie,
  _User as User,
};

export type {
  MovieAttributes,
  MovieCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Movie = _Movie.initModel(sequelize);
  const User = _User.initModel(sequelize);

  Movie.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Movie, { as: "movies", foreignKey: "userId"});

  return {
    Movie: Movie,
    User: User,
  };
}
