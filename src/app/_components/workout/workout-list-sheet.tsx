import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

import { Input } from "../ui/input";
import { PlusCircle, Search } from "lucide-react";
import { WorkoutCard } from "./workout-card";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";
import { Button } from "../ui/button";
import { type inferProcedureOutput } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

type WorkoutListSheetProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectWorkouts: (
    workouts: inferProcedureOutput<
      AppRouter["workout"]["get-infinite-workout"]
    >["workouts"],
  ) => void;
};
export default function WorkoutListSheet({
  isOpen,
  onOpenChange,
  onSelectWorkouts,
}: WorkoutListSheetProps) {
  const [selectedWorkouts, set_selectedWorkouts] = useState<
    inferProcedureOutput<
      AppRouter["workout"]["get-infinite-workout"]
    >["workouts"]
  >([]);
  const limit = 7;
  // const { workouts, nextOffset } =
  //   await serverClient.workout.getInfiniteWorkout({
  //     limit: limit,
  //   });

  const toggleWorkoutSelection = (
    workout: (typeof selectedWorkouts)[number],
  ) => {
    if (isWorkoutSelected(workout)) {
      set_selectedWorkouts([
        ...selectedWorkouts.filter((w) => w.id !== workout.id),
      ]);
    } else {
      set_selectedWorkouts([...selectedWorkouts, workout]);
    }
  };

  const isWorkoutSelected = (workout: (typeof selectedWorkouts)[number]) => {
    return !!selectedWorkouts.find((w) => w.id === workout.id);
  };

  const { data: workouts, isLoading } = api.workout[
    "get-infinite-workout"
  ].useInfiniteQuery(
    {
      limit: 7,
    },
    {
      enabled: isOpen,
    },
  );

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex h-full min-w-[340px]  flex-col"
      >
        <SheetHeader>
          <SheetTitle>Workout list</SheetTitle>
          <SheetDescription>
            Select the workout(s) you want to replace your current workout with
          </SheetDescription>
        </SheetHeader>

        <div className="relative flex items-center pt-3">
          <div className="absolute left-2 ">
            <Search size={18} className="text-muted" />
          </div>
          <Input
            className="pl-8 text-xs"
            type="search"
            placeholder="Search for name / description..."
          />
        </div>

        <div className="grow overflow-auto">
          <div className="flex flex-col gap-4  pt-6">
            {isLoading &&
              Array.from({ length: 10 }, (_i, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-lg" />
              ))}

            {workouts?.pages[0]?.workouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                type="workout"
                selection={{
                  onWorkoutSelect: () => toggleWorkoutSelection(workout),
                  isSelected: isWorkoutSelected(workout),
                }}
              />
            ))}
          </div>
        </div>

        {selectedWorkouts.length > 0 && (
          <SheetFooter className="">
            <SheetClose asChild>
              <Button
                size="sm"
                variant="outline"
                className="w-full items-center gap-2"
                onClick={() => onSelectWorkouts(selectedWorkouts)}
              >
                <PlusCircle size={18} />
                {`Add selection`}
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
