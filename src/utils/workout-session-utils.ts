import { type inferProcedureOutput } from "@trpc/server";
import { addMinutes } from "date-fns";
import { type AppRouter } from "~/server/api/root";

export type SessionType = NonNullable<
  inferProcedureOutput<AppRouter["workout-session"]["get-session-by-id"]>
>;

type SessionTypeFromEvent = inferProcedureOutput<
  AppRouter["event"]["get-events"]
>[number]["workoutSession"][number];

export const getSessionTotalTime = (session: SessionTypeFromEvent) => {
  return session.workoutResult.reduce(
    (sum, current) => sum + (current.workout.totalTime ?? 0),
    0,
  );
};

export const getColorByWorkoutType = (
  difficultyValue: SessionType["workoutResult"][number]["workout"]["difficulty"],
) => {
  switch (difficultyValue) {
    case "GREEN":
      return "bg-green-500";
    case "YELLOW":
      return "bg-yellow-500";
    case "RED":
      return "bg-red-500";
    case "BLACK":
      return "bg-foreground";
    default:
      break;
    // return "border border-foreground/10";
  }
};

export const areWorkoutResultsFilled = (
  results: SessionTypeFromEvent["workoutResult"],
) => {
  const resultsFilled = results.map((result) => isWorkoutResultFilled(result));
  if (resultsFilled.every((result) => result)) {
    return "filled";
  } else if (resultsFilled.some((result) => result)) {
    return "partial";
  } else {
    return "none";
  }
};

export const hasBenchmarkeableResult = (
  result: SessionType["workoutResult"][number],
) => {
  return result.time ?? result.totalReps ?? result.weight;
};

export const isWorkoutResultFilled = (
  result: SessionTypeFromEvent["workoutResult"][number],
) => {
  return (
    result.isRx ??
    (result.description && result.description !== "") ??
    result.totalReps ??
    result.weight ??
    result.rating ??
    result.time
  );
};

export const getWorkoutResultTimeDetails = ({
  workoutSession,
  warmupTime,
  breakBetweenElements,
}: {
  workoutSession: SessionType;
  breakBetweenElements: number;
  warmupTime: number;
}) => {
  const DEFAULT_TIME_FOR_WORKOUT = 12;
  const startingTime = workoutSession.event.eventDate;
  const endingWarmupTime = addMinutes(startingTime, warmupTime);
  let currentEndTime = endingWarmupTime;
  let totalTime = warmupTime;
  const sessionTimes = workoutSession.workoutResult.map((wr, index) => {
    const startingTime = currentEndTime;
    currentEndTime = addMinutes(
      startingTime,
      wr.workout.totalTime ?? DEFAULT_TIME_FOR_WORKOUT,
    );
    const data = {
      index: index,
      type: wr.workout.elementType.toLowerCase(),
      startingTime: startingTime,
      endingTime: currentEndTime,
      workoutTime: wr.workout.totalTime ?? DEFAULT_TIME_FOR_WORKOUT,
    };
    totalTime += wr.workout.totalTime ?? DEFAULT_TIME_FOR_WORKOUT;
    currentEndTime = addMinutes(currentEndTime, breakBetweenElements);
    return data;
  });
  return {
    startingTime: startingTime,
    endingWarmupTime: endingWarmupTime,
    totalTime: totalTime,
    sessionTimes: sessionTimes,
  };
};
