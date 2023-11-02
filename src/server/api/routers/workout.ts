import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const workoutRouter = createTRPCRouter({
  "get-infinite-workout": protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      }),
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 20;
      const cursor = input.cursor ?? 0;
      const result = await ctx.db.query.workout.findMany({
        limit: limit,
        offset: cursor,
      });
      let nextOffset;
      if (result.length > limit) {
        nextOffset = cursor + limit;
      }
      return {
        workouts: result,
        nextOffset: nextOffset,
      };
    }),
});
