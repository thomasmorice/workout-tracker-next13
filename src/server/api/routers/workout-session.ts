import { and, eq, gt, sql } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  workoutSession,
  event,
  workoutResult,
  workout,
} from "~/server/db/schema";
import { z } from "zod";

export const workoutSessionRouter = createTRPCRouter({
  "get-total-sessions": protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(workoutSession)
      .where(eq(workoutSession.athleteId, ctx.session.user.id));
    return result[0]?.count;
  }),

  "get-next-sessions": protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select()
      .from(workoutSession)
      .leftJoin(event, eq(event.id, workoutSession.eventId))
      .leftJoin(
        workoutResult,
        eq(workoutSession.id, workoutResult.workoutSessionId),
      )
      .leftJoin(workout, eq(workoutResult.workoutId, workout.id))
      .where(
        and(
          eq(workoutSession.athleteId, ctx.session.user.id),
          gt(event.eventDate, sql`CURRENT_DATE`),
        ),
      )
      .limit(3);

    return result;
  }),

  "get-session-by-id": protectedProcedure
    .input(
      z.object({
        workoutSessionId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.workoutSession.findFirst({
        with: {
          event: true,
          workoutResult: {
            with: {
              workout: true,
            },
            orderBy: (workoutResult, { asc }) => [asc(workoutResult.order)],
          },
        },

        where: and(
          eq(sql`${input.workoutSessionId}`, workoutSession.id),
          eq(workoutSession.athleteId, ctx.session.user.id),
        ),
      });
    }),
});
