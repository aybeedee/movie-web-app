import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Movie, MovieId } from './movie';
import type { User, UserId } from './user';

export interface ReviewAttributes {
  userId: string;
  movieId: string;
  comment: string;
  rating: number;
  createdAt: Date;
  edited: boolean;
}

export type ReviewPk = "userId" | "movieId";
export type ReviewId = Review[ReviewPk];
export type ReviewOptionalAttributes = "createdAt";
export type ReviewCreationAttributes = Optional<ReviewAttributes, ReviewOptionalAttributes>;

export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  userId!: string;
  movieId!: string;
  comment!: string;
  rating!: number;
  createdAt!: Date;
  edited!: boolean;

  // Review belongsTo Movie via movieId
  movie!: Movie;
  getMovie!: Sequelize.BelongsToGetAssociationMixin<Movie>;
  setMovie!: Sequelize.BelongsToSetAssociationMixin<Movie, MovieId>;
  createMovie!: Sequelize.BelongsToCreateAssociationMixin<Movie>;
  // Review belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Review {
    return sequelize.define('Review', {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id'
    },
    movieId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'movies',
        key: 'id'
      },
      field: 'movie_id'
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    edited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'reviews',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "reviews_pkey",
        unique: true,
        fields: [
          { name: "user_id" },
          { name: "movie_id" },
        ]
      },
    ]
  }) as typeof Review;
  }
}
