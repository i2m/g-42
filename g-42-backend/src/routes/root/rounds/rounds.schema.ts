import z from "zod";

const round = z.object({
  id: z.string().nonempty(),
  start: z.date(),
  end: z.date(),
  totalScore: z.number().nonnegative(),
});

const tap = z.object({
  roundId: z.string(),
  userId: z.string(),
  score: z.number().nonnegative(),
  count: z.number().nonnegative(),
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
      roundId: z.string().nonempty(),
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

export const TapSchema = {
  schema: {
    params: z.object({
      roundId: z.string().nonempty(),
    }),
    response: {
      200: tap,
    },
  },
};

export const MyScoreSchema = {
  schema: {
    params: z.object({
      roundId: z.string().nonempty(),
    }),
    response: {
      200: tap,
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
        username: z.string(),
        score: z.number().nonnegative(),
      }),
    },
  },
};

// Schemas for WebSocket

export const MakeTapMessage = z.object({
  type: z.literal("MakeTap"),
  data: z.object({
    roundId: z.string(),
  }),
});

export const TapMessage = z.object({
  type: z.literal("Tap"),
  data: tap,
});

export const ErrorMessage = z.object({
  type: z.literal("Error"),
  data: z.object({
    message: z.string(),
  }),
});
