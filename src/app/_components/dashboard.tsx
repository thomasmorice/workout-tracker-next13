"use client";
import { type AppRouter } from "~/server/api/root";
import { type inferProcedureOutput } from "@trpc/server";
import { format, formatDistanceToNow } from "date-fns";
import { Activity, Calendar } from "lucide-react";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type DashboardType = {
  totalSessions: inferProcedureOutput<
    AppRouter["workout-session"]["get-total-sessions"]
  >;
  nextSessions?: inferProcedureOutput<
    AppRouter["workout-session"]["get-next-sessions"]
  >;
};

export default function Dashboard({
  totalSessions,
  nextSessions,
}: DashboardType) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-4">
      <Card
        className="min-w-[280px] cursor-pointer"
        onClick={() => router.push(`/activities/workout-session/310`)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total sessions</CardTitle>
          <div className="flex flex-row items-center gap-x-1">
            <Activity className="text-primary" size={22} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSessions}</div>
          <p className="text-muted-foreground text-xs">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>

      {nextSessions?.[0]?.event && (
        <Card
          onClick={() =>
            router.push(
              `/activities/workout-session/${nextSessions[0]?.workoutSession.id}`,
            )
          }
          className="cursor-pointer"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming session
            </CardTitle>
            <div className="flex flex-row items-center gap-x-1">
              <Calendar size={24} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {nextSessions[0].event?.eventDate &&
                formatDistanceToNow(new Date(nextSessions[0].event.eventDate), {
                  addSuffix: true,
                })}
            </div>
            <p className="text-muted-foreground text-xs">
              {format(new Date(nextSessions[0].event?.eventDate), "PPPPp")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
