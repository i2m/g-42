import z from "zod";
import { UserRole } from "../users/users.models";

export const TapSchema = {
  schema: {
    params: z.object({
      roundId: z.string().nonempty(),
    }),
    response: {
      200: z.object({
        RoundId: z.string(),
        UserId: z.string(),
        score: z.number().nonnegative(),
        count: z.number().nonnegative(),
      }),
    },
  },
};

export const MyScoreSchema = {
  schema: {
    params: z.object({
      roundId: z.string().nonempty(),
    }),
    response: {
      200: z.object({
        RoundId: z.string(),
        UserId: z.string(),
        score: z.number().nonnegative(),
        count: z.number().nonnegative(),
      }),
    },
  },
};

export const WinnerSchema = {
  schema: {
    params: z.object({
      roundId: z.string().nonempty(),
    }),
    response: {
      200: z.object({
        id: z.string(),
        username: z.string(),
        role: z.enum(UserRole),
      }),
    },
  },
};
