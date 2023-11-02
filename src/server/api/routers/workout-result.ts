import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { workoutResult } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const workoutResultRouter = createTRPCRouter({
  "add-or-edit": protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        workoutId: z.number(),
        workoutSessionId: z.number(),
        description: z.string().nullish(),
        rating: z.number().nullish(),
        order: z.number(),
        shouldRecommendWorkoutAgain: z.boolean().optional(),
        isRx: z.boolean().nullish(),
        totalReps: z.number().nullish(),
        weight: z.number().nullish(),
        time: z.number().nullish(),
        // workout: z.object({
        //   id: z.number(), // Yep, id is mandatory in workout result, you can't add a result to a non existing workout..
        // }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedAt = {
        updatedAt: new Date(),
      };
      if (input.id) {
        await ctx.db
          .update(workoutResult)
          .set({ ...input })
          .where(eq(workoutResult.id, input.id));
      } else {
        await ctx.db.insert(workoutResult).values({ ...input, ...updatedAt });
      }
    }),
});
