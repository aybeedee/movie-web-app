import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { User, UserId } from './user';

export interface MovieAttributes {
  id: string;
  title: string;
  userId: string;
}

export type MoviePk = "id";
export type MovieId = Movie[MoviePk];
export type MovieOptionalAttributes = "id";
export type MovieCreationAttributes = Optional<MovieAttributes, MovieOptionalAttributes>;

export class Movie extends Model<MovieAttributes, MovieCreationAttributes> implements MovieAttributes {
  id!: string;
  title!: string;
  userId!: string;

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
      allowNull: false
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
    timestamps: false,
    indexes: [
      {
        name: "movies_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  }) as typeof Movie;
  }
}
