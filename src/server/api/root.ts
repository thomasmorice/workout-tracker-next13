import { createTRPCRouter } from "~/server/api/trpc";
import { workoutSessionRouter } from "./routers/workout-session";
import { workoutRouter } from "./routers/workout";
import { workoutResultRouter } from "./routers/workout-result";
import { eventRouter } from "./routers/event";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  workout: workoutRouter,
  "workout-session": workoutSessionRouter,
  "workout-result": workoutResultRouter,
  event: eventRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
