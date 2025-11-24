import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";
import { hash } from "./users.utils";

export async function initModels(sequelize: Sequelize, salt: number | string) {
  const User = await initUserModel(sequelize, salt);
  return { User };
}

export enum UserRole {
  Survival = "survival",
  Admin = "admin",
  Nikita = "nikita",
}

export interface User
  extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  id: CreationOptional<string>;
  username: string;
  password: string;
  role: UserRole;
}

export async function initUserModel(
  sequelize: Sequelize,
  salt: number | string,
) {
  const User = sequelize.define<User>(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM,
        values: [UserRole.Survival, UserRole.Admin, UserRole.Nikita],
        defaultValue: UserRole.Survival,
        allowNull: false,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          // Hash the password asynchronously before creation
          const hashedPassword = await hash(user.password, salt);
          user.password = hashedPassword;
        },
        beforeUpdate: async (user) => {
          // Re-hash the password only if it has been changed
          if (user.changed("password")) {
            const hashedPassword = await hash(user.password, salt);
            user.password = hashedPassword;
          }
        },
      },
    },
  );

  await User.sync();

  return User;
}

export function detectUserRole(username: string): UserRole {
  let role = UserRole.Survival;
  if (username.startsWith(UserRole.Admin)) {
    role = UserRole.Admin;
  } else if (username.startsWith(UserRole.Nikita)) {
    role = UserRole.Nikita;
  }
  return role;
}
