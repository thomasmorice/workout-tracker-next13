"use client";

import { addMinutes, format } from "date-fns";
import { useEffect, useState } from "react";

import { Plus } from "lucide-react";
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";
import { cn } from "~/utils";
import { Button } from "~/app/_components/ui/button";
import { enumToString } from "~/utils/";

type WorkoutSessionTimelineProps = {
  workoutSession: NonNullable<
    inferProcedureOutput<AppRouter["workout-session"]["get-session-by-id"]>
  >;
  onSelectNewWorkout: () => void;
  selectedValue: number;
  warmupTime: number;
  breakBetweenElements: number;
};

export default function WorkoutSessionTimeline({
  workoutSession,
  warmupTime,
  selectedValue,
  breakBetweenElements,
  onSelectNewWorkout,
}: WorkoutSessionTimelineProps) {
  const DEFAULT_TIME_FOR_WORKOUT = 12;
  const startingTime = new Date(workoutSession.event.eventDate);
  const [totalTime, set_totalTime] = useState<number>(0);
  const [workoutWithStartAndEndTime, set_workoutWithStartAndEndTime] = useState<
    {
      name: string;
      type: string;
      startingTime: Date;
      endingTime: Date;
      workoutTime: number;
    }[]
  >([]);

  useEffect(() => {
    let currentEndTime = addMinutes(startingTime, warmupTime);
    let totalTimeTemp = warmupTime;
    const array = [
      {
        name: "Warmup",
        type: "warm-up",
        startingTime: startingTime,
        endingTime: currentEndTime,
        workoutTime: warmupTime,
      },
    ];

    workoutSession.workoutResult.map((wr) => {
      const startingTime = currentEndTime;
      currentEndTime = addMinutes(
        startingTime,
        wr.workout.totalTime ?? DEFAULT_TIME_FOR_WORKOUT,
      );
      array.push({
        name: wr.workout.name ?? enumToString(wr.workout.elementType),
        type: wr.workout.elementType.toLowerCase(),
        startingTime: startingTime,
        endingTime: currentEndTime,
        workoutTime: wr.workout.totalTime ?? DEFAULT_TIME_FOR_WORKOUT,
      });
      currentEndTime = addMinutes(currentEndTime, breakBetweenElements);
      totalTimeTemp += wr.workout.totalTime ?? DEFAULT_TIME_FOR_WORKOUT;
    });
    set_workoutWithStartAndEndTime(array);
    set_totalTime(totalTimeTemp);
  }, []);

  return (
    <div className=" flex min-h-[30px] w-full items-end justify-around gap-2">
      {workoutWithStartAndEndTime.map((element, index) => (
        <div
          key={index}
          style={{
            transition:
              index === selectedValue
                ? "width 0.2s ease-in, color 0.2s ease-in-out 0.2s, background-color 0.1s, padding 0.1s ease-out"
                : "width 0.3s ease-in, color 0s ease-in-out 0s, background-color 0.1s, padding 0.3s ease-out",
            width:
              index === selectedValue
                ? "auto"
                : `${(element.workoutTime * 100) / totalTime}%`,
          }}
          // onClick={() => set_selectedResultIndex(index)}
          className={cn(
            `flex items-center justify-center  rounded-t-md bg-muted text-xs font-semibold leading-none tracking-wide `,
            index === selectedValue
              ? "shrink-0  bg-muted px-4 py-2"
              : "h-3 overflow-hidden whitespace-nowrap text-foreground/0",
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col items-center gap-1">
              {/* <div className="uppercase">{element.name}</div> */}
              <div>
                {`${format(element.startingTime, "h:mm")} -
            ${format(element.endingTime, "p")} `}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
