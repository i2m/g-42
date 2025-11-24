import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ModelCtor,
  Sequelize,
} from "sequelize";

import { Round } from "../rounds/rounds.models";
import type { User } from "../users/users.models";

export async function initModels(sequelize: Sequelize) {
  const Tap = await initTapModel(sequelize);
  const Round = sequelize.models.Round as ModelCtor<Round>;
  const User = sequelize.models.User as ModelCtor<User>;
  return { Tap, Round, User };
}

export interface Tap
  extends Model<InferAttributes<Tap>, InferCreationAttributes<Tap>> {
  RoundId: string;
  UserId: string;
  score: number;
  count: number;
}

async function initTapModel(sequelize: Sequelize) {
  const { User, Round } = sequelize.models;

  const Tap = sequelize.define<Tap>("Tap", {
    RoundId: {
      type: DataTypes.UUID,
      references: {
        model: Round,
        key: "id",
      },
    },
    UserId: {
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

  Round.belongsToMany(User, { through: Tap });
  User.belongsToMany(Round, { through: Tap });

  await Tap.sync();

  return Tap;
}
