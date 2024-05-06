import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { Movie, MovieId } from "./movie";

export interface UserAttributes {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export type UserPk = "id";
export type UserId = User[UserPk];
export type UserOptionalAttributes = "id";
export type UserCreationAttributes = Optional<
	UserAttributes,
	UserOptionalAttributes
>;

export class User
	extends Model<UserAttributes, UserCreationAttributes>
	implements UserAttributes
{
	id!: string;
	firstName!: string;
	lastName!: string;
	email!: string;
	password!: string;

	// User hasMany Movie via userId
	movies!: Movie[];
	getMovies!: Sequelize.HasManyGetAssociationsMixin<Movie>;
	setMovies!: Sequelize.HasManySetAssociationsMixin<Movie, MovieId>;
	addMovie!: Sequelize.HasManyAddAssociationMixin<Movie, MovieId>;
	addMovies!: Sequelize.HasManyAddAssociationsMixin<Movie, MovieId>;
	createMovie!: Sequelize.HasManyCreateAssociationMixin<Movie>;
	removeMovie!: Sequelize.HasManyRemoveAssociationMixin<Movie, MovieId>;
	removeMovies!: Sequelize.HasManyRemoveAssociationsMixin<Movie, MovieId>;
	hasMovie!: Sequelize.HasManyHasAssociationMixin<Movie, MovieId>;
	hasMovies!: Sequelize.HasManyHasAssociationsMixin<Movie, MovieId>;
	countMovies!: Sequelize.HasManyCountAssociationsMixin;

	static initModel(sequelize: Sequelize.Sequelize): typeof User {
		return sequelize.define(
			"User",
			{
				id: {
					type: DataTypes.UUID,
					allowNull: false,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
				},
				firstName: {
					type: DataTypes.STRING(50),
					allowNull: false,
					field: "first_name",
				},
				lastName: {
					type: DataTypes.STRING(50),
					allowNull: false,
					field: "last_name",
				},
				email: {
					type: DataTypes.STRING(100),
					allowNull: false,
					unique: "users_email_key",
				},
				password: {
					type: DataTypes.STRING(100),
					allowNull: false,
				},
			},
			{
				defaultScope: {
					attributes: { exclude: ["password"] },
				},
				scopes: {
					withPassword: {},
				},
				tableName: "users",
				schema: "public",
				timestamps: false,
				indexes: [
					{
						name: "users_email_key",
						unique: true,
						fields: [{ name: "email" }],
					},
					{
						name: "users_pkey",
						unique: true,
						fields: [{ name: "id" }],
					},
				],
			}
		) as typeof User;
	}
}
