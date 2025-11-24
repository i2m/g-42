import z from "zod";
import { UserRole } from "./users.models";

export const UserLoginSchema = {
  schema: {
    body: z.object({
      username: z.string().nonempty(),
      password: z.string().nonempty(),
    }),
    response: {
      200: z.object({
        id: z.string(),
        username: z.string(),
        role: z.enum(UserRole),
        accessToken: z.string(),
      }),
    },
  },
};
