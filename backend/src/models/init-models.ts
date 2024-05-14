import type { Sequelize } from "sequelize";
import { Movie as _Movie } from "./movie";
import type { MovieAttributes, MovieCreationAttributes } from "./movie";
import { Review as _Review } from "./review";
import type { ReviewAttributes, ReviewCreationAttributes } from "./review";
import { User as _User } from "./user";
import type { UserAttributes, UserCreationAttributes } from "./user";

export { _Movie as Movie, _Review as Review, _User as User };

export type {
	MovieAttributes,
	MovieCreationAttributes,
	ReviewAttributes,
	ReviewCreationAttributes,
	UserAttributes,
	UserCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
	const Movie = _Movie.initModel(sequelize);
	const Review = _Review.initModel(sequelize);
	const User = _User.initModel(sequelize);

	Movie.belongsToMany(User, {
		as: "userIdUsers",
		through: Review,
		foreignKey: "movieId",
		otherKey: "userId",
	});
	User.belongsToMany(Movie, {
		as: "movieIdMovies",
		through: Review,
		foreignKey: "userId",
		otherKey: "movieId",
	});
	Review.belongsTo(Movie, { as: "movie", foreignKey: "movieId" });
	Movie.hasMany(Review, { as: "reviews", foreignKey: "movieId" });
	Movie.belongsTo(User, { as: "user", foreignKey: "userId" });
	User.hasMany(Movie, { as: "movies", foreignKey: "userId" });
	Review.belongsTo(User, { as: "user", foreignKey: "userId" });
	User.hasMany(Review, { as: "reviews", foreignKey: "userId" });

	return {
		Movie: Movie,
		Review: Review,
		User: User,
	};
}
