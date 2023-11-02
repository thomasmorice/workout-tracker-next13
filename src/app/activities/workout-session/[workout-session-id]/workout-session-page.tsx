"use client";
import { type inferProcedureOutput } from "@trpc/server";
import { useState } from "react";
import {
  WorkoutCard,
  type WarmUpType,
  type WorkoutResultType,
} from "~/app/_components/workout/workout-card";
import { type AppRouter } from "~/server/api/root";
import WorkoutSessionHeader from "./workout-session-header";
import WorkoutListSheet from "~/app/_components/workout/workout-list-sheet";
import { Drawer } from "vaul";
import WorkoutResultForm from "~/app/_components/workout-result/workout-result-form";
import { Button } from "~/app/_components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "~/app/_components/ui/separator";
import { getWorkoutResultTimeDetails } from "~/utils/workout-session-utils";

type WorkoutSessionPageProps = {
  workoutSession: NonNullable<
    inferProcedureOutput<AppRouter["workout-session"]["get-session-by-id"]>
  >;
};
export type WorkoutResult =
  WorkoutSessionPageProps["workoutSession"]["workoutResult"][number];

export type WorkoutSessionCardProps = (WarmUpType | WorkoutResultType) & {
  handleIsOnScreen?: () => void;
  handleShowWorkoutSelectorSheet?: () => void;
};

export default function WorkoutSessionPage({
  workoutSession,
}: WorkoutSessionPageProps) {
  const WARMUP_TIME = 12; // 12 minutes are considered for a warm up
  const BREAK_BETWEEN_ELEMENTS = 5; // 5 minutes are considered between each elements
  const [showWorkoutSelectorSheet, set_showWorkoutSelectorSheet] = useState<
    boolean | "add" | "replace"
  >(false);
  const [showResultForm, set_showResultForm] = useState<WorkoutResult>();
  const workoutResultsTimeDetails = getWorkoutResultTimeDetails({
    workoutSession,
    warmupTime: WARMUP_TIME,
    breakBetweenElements: BREAK_BETWEEN_ELEMENTS,
  });

  console.log("workoutResultsTimeDetails", workoutResultsTimeDetails);
  return (
    <>
      <WorkoutSessionHeader workoutSession={workoutSession} />
      <WorkoutListSheet
        onOpenChange={(open) => set_showWorkoutSelectorSheet(open)}
        onSelectWorkouts={(workouts) => console.log("workouts", workouts)}
        isOpen={!!showWorkoutSelectorSheet}
      />

      <>
        <Drawer.Root
          onClose={() => set_showResultForm(undefined)}
          open={!!showResultForm}
        >
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-10 bg-background/80" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex max-h-[85%] min-h-[10%] flex-col rounded-t-[10px] border border-t bg-background px-4 pb-4 outline-none">
              <div className="mx-auto my-4 h-1 w-16 flex-shrink-0 rounded-full bg-foreground" />
              {showResultForm && (
                <WorkoutResultForm workoutResult={showResultForm} />
              )}
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </>

      <div className="sticky top-0 z-20 h-full rounded-t-3xl border-t bg-background">
        <div className="flex flex-col gap-2 px-5 py-5">
          <div className="flex items-center justify-between  text-xl font-black">
            {/* <WorkoutSessionActionBar workoutSession={workoutSession} /> */}
            {/* <WorkoutSessionTimeline
            workoutSession={workoutSession}
            selectedValue={elemVisibleOnTimeline}
            warmupTime={WARMUP_TIME}
            breakBetweenElements={BREAK_BETWEEN_ELEMENTS}
            onSelectNewWorkout={() => set_showWorkoutSelectorSheet("add")}
          /> */}
            <div className="flex items-center gap-2">
              Session workouts
              <div className="text-foreground/50">
                ({workoutSession.workoutResult.length})
              </div>
            </div>
            <Button
              onClick={() => set_showWorkoutSelectorSheet("add")}
              variant="outline"
              size="icon"
              className="h-8 w-8"
            >
              <Plus size={20} />
            </Button>
          </div>
        </div>

        <div className="relative z-10 shadow-sm shadow-black">
          <Separator />
        </div>

        <div className="flex h-[calc(100%-163px)] flex-col items-start gap-10  overflow-scroll  px-5 pt-6">
          <WorkoutCard
            type="warm-up"
            workoutTime={{
              startingTime: workoutResultsTimeDetails.startingTime,
              endingTime: workoutResultsTimeDetails.endingWarmupTime,
            }}
            workout={{
              totalTime: WARMUP_TIME,
              description: `Before diving into a CrossFit workout, a brief and essential warm-up is key. \n\nStart with 5-10 minutes of light cardio to raise your heart rate, then perform dynamic stretches to enhance flexibility and mobility.`,
            }}
          />

          {workoutSession.workoutResult.map((result, index) => {
            return (
              <WorkoutCard
                key={result.id}
                type="workout-result"
                workoutResult={result}
                workoutTime={{
                  startingTime:
                    workoutResultsTimeDetails.sessionTimes[index]?.startingTime,
                  endingTime:
                    workoutResultsTimeDetails.sessionTimes[index]?.endingTime,
                }}
                actions={{
                  onReplaceWorkout: () =>
                    set_showWorkoutSelectorSheet("replace"),
                  onShowResultForm: () => set_showResultForm(result),
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
