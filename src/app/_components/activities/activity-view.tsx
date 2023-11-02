"use client";
import { useState } from "react";
import { Calendar } from "../ui/calendar";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  CheckCircle2,
  Circle,
  CircleSlash,
  ClipboardList,
  Watch,
} from "lucide-react";
import { format, parse } from "date-fns";

import { Skeleton } from "../ui/skeleton";
import {
  getSessionTotalTime,
  areWorkoutResultsFilled,
} from "~/utils/workout-session-utils";
import { useRouter } from "next/navigation";
import { type AppRouter } from "~/server/api/root";
import { type inferProcedureOutput } from "@trpc/server";

type ActivityViewProps = {
  activities?: inferProcedureOutput<AppRouter["event"]["get-events"]>;
  currentDate?: Date;
};

export default function ActivityView({
  activities,
  currentDate,
}: ActivityViewProps) {
  const [day, set_day] = useState<Date | undefined>(new Date());
  const daysWithActivities = activities?.map(
    (activity) => new Date(activity.eventDate),
  );
  const router = useRouter();

  return (
    <div className="pt-5">
      <Calendar
        mode="single"
        month={currentDate}
        onMonthChange={(date) => {
          if (currentDate) {
            router.push(`/activities/${format(date, "MM'/'yyyy")}`);
          }
        }}
        selected={day}
        modifiers={daysWithActivities && { withActivities: daysWithActivities }}
        modifiersClassNames={{
          withActivities: "with-activities",
        }}
        isLoading={!activities}
        onSelect={set_day}
        className="rounded-md border dark:border-slate-800"
      />

      {!activities ? (
        <div className="flex flex-col gap-y-5 pt-4">
          {Array.from({ length: 5 }, (_i, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-y-5 pt-4">
          {activities?.map((activity) => (
            <Card
              className="cursor-pointer"
              onClick={() =>
                router.push(
                  `/activities/workout-session/${activity.workoutSession[0]?.id}`,
                )
              }
              key={activity.id}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  {format(new Date(activity.eventDate), "PPp")}
                  <div className="text-muted-foreground">
                    {
                      {
                        none: <Circle className="" size={22} />,
                        partial: <CircleSlash className="" size={22} />,
                        filled: <CheckCircle2 size={22} />,
                      }[
                        activity.workoutSession[0]?.workoutResult
                          ? areWorkoutResultsFilled(
                              activity.workoutSession[0]?.workoutResult,
                            )
                          : "none"
                      ]
                    }
                  </div>
                </CardTitle>
                <CardDescription className="flex flex-col gap-0.5">
                  <span className="flex items-center gap-2.5  ">
                    <Watch className="text-muted-foreground" size={17} />
                    {activity.workoutSession[0] &&
                      getSessionTotalTime(activity.workoutSession[0])}
                    mn session
                  </span>
                  <span className="flex items-center gap-2.5">
                    <ClipboardList
                      className="text-muted-foreground"
                      size={17}
                    />
                    {activity.workoutSession[0]?.workoutResult.length} workouts
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
