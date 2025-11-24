import z from "zod";

const round = z.object({
  id: z.string().nonempty(),
  start: z.date(),
  end: z.date(),
  totalScore: z.number().nonnegative(),
});

export const RoundListSchema = {
  schema: {
    response: {
      200: z.array(round),
    },
  },
};

export const RoundFindByIdSchema = {
  schema: {
    params: z.object({
      id: z.string().nonempty(),
    }),
    response: {
      200: round,
    },
  },
};

export const RoundCreateSchema = {
  schema: {
    response: {
      200: round,
    },
  },
};
