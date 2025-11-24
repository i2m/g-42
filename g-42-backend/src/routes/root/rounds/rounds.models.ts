import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export async function initModels(sequelize: Sequelize) {
  const Round = await initRoundModel(sequelize);
  return { Round };
}

export interface Round
  extends Model<InferAttributes<Round>, InferCreationAttributes<Round>> {
  id: CreationOptional<string>;
  start: Date;
  end: Date;
  totalScore: number;
}

async function initRoundModel(sequelize: Sequelize) {
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

  return Round;
}
