import { db } from "~/server/db";
import usersjson from "./2023102710/_User_.json";
import accountsjson from "./2023102710/_Account_.json";
import sessionsjson from "./2023102710/_Session_.json";
import workoutsjson from "./2023102710/_Workout_.json";
import workoutResultsjson from "./2023102710/_WorkoutResult_.json";
import workoutSessionsjson from "./2023102710/_WorkoutSession_.json";
import eventsjson from "./2023102710/_Event_.json";

import {
  users,
  accounts,
  sessions,
  workout,
  event,
  workoutResult,
  workoutSession,
} from "~/server/db/schema";
import { sql } from "drizzle-orm";

// usersjson.User.map((user) => {
//   db.insert({

//   }
// });

await db
  .insert(users)
  .values(usersjson.User.map((user) => user))
  .onDuplicateKeyUpdate({ set: { id: sql`id` } });

await db
  .insert(accounts)
  .values(
    accountsjson.Account.map((account) => ({
      ...account,
      type: account.type as "oauth",
    })),
  )
  .onDuplicateKeyUpdate({ set: { providerAccountId: sql`providerAccountId` } });

await db
  .insert(sessions)
  .values(
    sessionsjson.Session.map((session) => ({
      ...session,
      expires: new Date(session.expires),
    })),
  )
  .onDuplicateKeyUpdate({ set: { sessionToken: sql`sessionToken` } });

await db
  .insert(workout)
  .values(
    workoutsjson.Workout.map((w) => {
      return {
        ...w,
        createdAt: new Date(w.createdAt),
        updatedAt: new Date(w.updatedAt),
        affiliateDate: w.affiliateDate ? new Date(w.affiliateDate) : null,
        difficulty: w.difficulty as "RED" | "BLACK" | "GREEN" | "YELLOW",
        elementType: w.elementType as
          | "STRENGTH_OR_SKILLS"
          | "INTENSE_MOBILITY"
          | "WOD"
          | "ENDURANCE"
          | "STRENGTH"
          | "OLYMPIC_WEIGHTLIFTING"
          | "GYMNASTICS"
          | "CARDIO"
          | "TEAMWOD"
          | "UNCLASSIFIED",
        workoutType: w.workoutType as
          | "FOR_TIME"
          | "AMRAP"
          | "EMOM"
          | "ONE_REP_MAX"
          | "X_REP_MAX",
      };
    }),
  )
  .onDuplicateKeyUpdate({ set: { id: sql`id` } });

await db
  .insert(workoutResult)
  .values(
    workoutResultsjson.WorkoutResult.map((wr) => ({
      ...wr,
      createdAt: new Date(wr.createdAt),
      updatedAt: new Date(wr.updatedAt),
    })),
  )
  .onDuplicateKeyUpdate({ set: { id: sql`id` } });

await db
  .insert(workoutSession)
  .values(workoutSessionsjson.WorkoutSession.map((ws) => ws))
  .onDuplicateKeyUpdate({ set: { id: sql`id` } });

await db
  .insert(event)
  .values(
    eventsjson.Event.map((e) => ({
      ...e,
      eventDate: new Date(e.eventDate),
      createdAt: new Date(e.createdAt),
      updatedAt: new Date(e.updatedAt),
    })),
  )
  .onDuplicateKeyUpdate({ set: { id: sql`id` } });
