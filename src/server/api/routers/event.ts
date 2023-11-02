import { eq, sql, gt, and, lt, desc } from "drizzle-orm";
import { z } from "zod";
import { workoutSession, event } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  "get-events": protectedProcedure
    .input(
      z.object({
        dateFilter: z
          .object({
            lte: z.date(),
            gte: z.date(),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const qb = ctx.db.query.event.findMany({
        with: {
          workoutSession: {
            where: eq(workoutSession.athleteId, ctx.session.user.id),
            with: {
              workoutResult: {
                with: {
                  workout: {
                    columns: {
                      difficulty: true,
                      totalTime: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: and(
          lt(sql`${input.dateFilter?.lte}`, event.eventDate),
          gt(sql`${input.dateFilter?.gte}`, event.eventDate),
          // eq(ctx.session.user.id, )
          // ((workoutSession, { eq }) => eq(workoutSession.athleteId, ctx.session.user.id)),
        ),
        orderBy: [desc(event.eventDate)],
      });
      const result = await qb;

      const filteredResult = result.filter(
        (activity) => activity.workoutSession.length !== 0,
      );

      return filteredResult;
    }),
  "edit-event": protectedProcedure
    .input(
      z.object({
        id: z.number(),
        date: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedAt = new Date();
      if (input.id) {
        await ctx.db
          .update(event)
          .set({
            eventDate: input.date,
            updatedAt: updatedAt,
          })
          .where(eq(event.id, input.id));
      }
    }),
});
