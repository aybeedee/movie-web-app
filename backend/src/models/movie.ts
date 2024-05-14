import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { Review, ReviewId } from './review';
import type { User, UserId } from './user';

export interface MovieAttributes {
  id: string;
  title: string;
  description: string;
  durationHours: number;
  durationMinutes: number;
  reviewCount: number;
  posterUrl: string;
  trailerUrl: string;
  createdAt: Date;
  userId: string;
}

export type MoviePk = "id";
export type MovieId = Movie[MoviePk];
export type MovieOptionalAttributes = "id" | "reviewCount" | "createdAt";
export type MovieCreationAttributes = Optional<MovieAttributes, MovieOptionalAttributes>;

export class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
  id!: string;
  title!: string;
  description!: string;
  durationHours!: number;
  durationMinutes!: number;
  reviewCount!: number;
  posterUrl!: string;
  trailerUrl!: string;
  createdAt!: Date;
  userId!: string;

  // Movie hasMany Review via movieId
  reviews!: Review[];
  getReviews!: Sequelize.HasManyGetAssociationsMixin<Review>;
  setReviews!: Sequelize.HasManySetAssociationsMixin<Review, ReviewId>;
  addReview!: Sequelize.HasManyAddAssociationMixin<Review, ReviewId>;
  addReviews!: Sequelize.HasManyAddAssociationsMixin<Review, ReviewId>;
  createReview!: Sequelize.HasManyCreateAssociationMixin<Review>;
  removeReview!: Sequelize.HasManyRemoveAssociationMixin<Review, ReviewId>;
  removeReviews!: Sequelize.HasManyRemoveAssociationsMixin<Review, ReviewId>;
  hasReview!: Sequelize.HasManyHasAssociationMixin<Review, ReviewId>;
  hasReviews!: Sequelize.HasManyHasAssociationsMixin<Review, ReviewId>;
  countReviews!: Sequelize.HasManyCountAssociationsMixin;
  // Movie belongsToMany User via movieId and userId
  userIdUsers!: User[];
  getUserIdUsers!: Sequelize.BelongsToManyGetAssociationsMixin<User>;
  setUserIdUsers!: Sequelize.BelongsToManySetAssociationsMixin<User, UserId>;
  addUserIdUser!: Sequelize.BelongsToManyAddAssociationMixin<User, UserId>;
  addUserIdUsers!: Sequelize.BelongsToManyAddAssociationsMixin<User, UserId>;
  createUserIdUser!: Sequelize.BelongsToManyCreateAssociationMixin<User>;
  removeUserIdUser!: Sequelize.BelongsToManyRemoveAssociationMixin<User, UserId>;
  removeUserIdUsers!: Sequelize.BelongsToManyRemoveAssociationsMixin<User, UserId>;
  hasUserIdUser!: Sequelize.BelongsToManyHasAssociationMixin<User, UserId>;
  hasUserIdUsers!: Sequelize.BelongsToManyHasAssociationsMixin<User, UserId>;
  countUserIdUsers!: Sequelize.BelongsToManyCountAssociationsMixin;
  // Movie belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Movie {
    return sequelize.define('Movie', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "movies_title_key"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    durationHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'duration_hours'
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'duration_minutes'
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'review_count'
    },
    posterUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'poster_url'
    },
    trailerUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'trailer_url'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id'
    }
  }, {
    tableName: 'movies',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "movies_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "movies_title_key",
        unique: true,
        fields: [
          { name: "title" },
        ]
      },
    ]
  }) as typeof Movie;
  }
}
