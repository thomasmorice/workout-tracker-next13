import { relations, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  float,
  index,
  int,
  mysqlEnum,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator(
  (name) => `workout-tracker-t3_${name}`,
);

export const event = mysqlTable("event", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  eventDate: timestamp("eventDate").notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`),
});

export const eventRelations = relations(event, ({ many }) => ({
  workoutSession: many(workoutSession),
}));

export const workoutSession = mysqlTable("workoutSession", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  athleteId: text("athleteId").default("cl6jsjxy00006uyo8h2v8fr2e").notNull(),
  eventId: bigint("eventId", { mode: "number" }).notNull(),
});

export const workoutSessionRelations = relations(
  workoutSession,
  ({ one, many }) => ({
    workoutResult: many(workoutResult),
    event: one(event, {
      fields: [workoutSession.eventId],
      references: [event.id],
    }),
  }),
);

export const workoutResult = mysqlTable("WorkoutResult", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  workoutSessionId: int("workoutSessionId").notNull(),
  workoutId: int("workoutId").notNull(),
  isRx: boolean("isRx"),
  totalReps: int("totalReps"),
  time: int("time"),
  rating: int("rating"),
  description: text("description"),
  shouldRecommendWorkoutAgain: boolean("shouldRecommendWorkoutAgain")
    .default(false)
    .notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`),
  weight: float("weight"),
  order: int("order").notNull(),
});

export const workoutResultsRelation = relations(workoutResult, ({ one }) => ({
  workoutSession: one(workoutSession, {
    fields: [workoutResult.workoutSessionId],
    references: [workoutSession.id],
  }),
  workout: one(workout, {
    fields: [workoutResult.workoutId],
    references: [workout.id],
  }),
}));

export const workout = mysqlTable("workout", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  name: varchar("name", { length: 256 }),
  difficulty: mysqlEnum("difficulty", ["GREEN", "YELLOW", "RED", "BLACK"]),
  elementType: mysqlEnum("elementType", [
    "CARDIO",
    "ENDURANCE",
    "GYMNASTICS",
    "INTENSE_MOBILITY",
    "OLYMPIC_WEIGHTLIFTING",
    "STRENGTH",
    "STRENGTH_OR_SKILLS",
    "TEAMWOD",
    "UNCLASSIFIED",
    "WOD",
  ])
    .default("UNCLASSIFIED")
    .notNull(),
  isDoableAtHome: boolean("isDoableAtHome").default(false),
  description: text("description").notNull(),
  totalTime: float("totalTime"),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`),
  creatorId: varchar("creatorId", { length: 255 }).notNull(),
  workoutType: mysqlEnum("workoutType", [
    "AMRAP",
    "EMOM",
    "FOR_TIME",
    "ONE_REP_MAX",
    "X_REP_MAX",
  ]),
  affiliateId: int("affiliateId"),
  affiliateDate: timestamp("affiliateDate"),
  isGlobal: boolean("isGlobal").default(false).notNull(),
});

export const workoutRelations = relations(workout, ({ many }) => ({
  workoutResult: many(workoutResult),
}));

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = mysqlTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
