import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
  ModelCtor,
} from "sequelize";

import type { User } from "../users/users.models";

export async function initModels(sequelize: Sequelize) {
  const User = sequelize.models.User as ModelCtor<User>;

  const Round = sequelize.define<Round>("Round", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalScore: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      allowNull: false,
    },
  });

  await Round.sync();

  const Tap = sequelize.define<Tap>("Tap", {
    roundId: {
      type: DataTypes.UUID,
      references: {
        model: Round,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
    },
    score: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      allowNull: false,
    },
    count: {
      type: DataTypes.DOUBLE,
      defaultValue: 0,
      allowNull: false,
    },
  });

  await Tap.sync();

  Tap.belongsTo(Round, { foreignKey: "roundId" });
  Round.hasMany(Tap, { foreignKey: "roundId" });

  Tap.belongsTo(User, { foreignKey: "userId" });
  User.hasMany(Tap, { foreignKey: "userId" });

  return { Round, Tap, User };
}

export interface Round
  extends Model<InferAttributes<Round>, InferCreationAttributes<Round>> {
  id: CreationOptional<string>;
  start: Date;
  end: Date;
  totalScore: number;
}

export interface Tap
  extends Model<InferAttributes<Tap>, InferCreationAttributes<Tap>> {
  roundId: string;
  userId: string;
  score: number;
  count: number;
}
