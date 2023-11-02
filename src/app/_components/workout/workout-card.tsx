"use client";

import * as React from "react";
import { type ReactNode, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  getColorByWorkoutType,
  isWorkoutResultFilled,
} from "~/utils/workout-session-utils";
import { enumToString } from "~/utils";
import {
  CalendarClock,
  CheckCircle,
  Circle,
  Clock,
  Dumbbell,
  FormInput,
  Heart,
  MoreVertical,
} from "lucide-react";
import { cn } from "~/utils";
import WorkoutCardDropdown from "./workout-card-dropdown";
import { type inferProcedureOutput } from "@trpc/server";

import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useIntersectionObserver } from "usehooks-ts";
import { type AppRouter } from "~/server/api/root";
import { type WorkoutSessionCardProps } from "~/app/activities/workout-session/[workout-session-id]/workout-session-page";
import { Separator } from "../ui/separator";
import { WorkoutResultContent } from "../workout-result/workout-result-card";
import { format } from "date-fns";

type WorkoutResult = NonNullable<
  inferProcedureOutput<AppRouter["workout-session"]["get-session-by-id"]>
>["workoutResult"][number];

export type WarmUpType = {
  type: "warm-up";
  workoutTime: {
    startingTime?: Date;
    endingTime?: Date;
  };
  workout: {
    totalTime: number;
    description: string;
  };
};

export type WorkoutResultType = {
  type: "workout-result";
  workoutResult: WorkoutResult;
  workoutTime: {
    startingTime?: Date;
    endingTime?: Date;
  };
};

export type WorkoutType = {
  type: "workout";
  workout: WorkoutResult["workout"];
};

export type WorkoutActions = {
  actions?: {
    onReplaceWorkout?: () => void;
    onShowResultForm?: () => void;
    onShowDetails?: () => void;
    // workoutSelection?: {
    //   onSelectWorkout?: () => void;
    //   isSelected?: boolean;
    // };
  };
};

export type WorkoutSelection = {
  selection?: {
    isSelected?: boolean;
    onWorkoutSelect: () => void;
  };
};

type WorkoutCardProps = (WorkoutSessionCardProps | WorkoutType) &
  WorkoutActions &
  WorkoutSelection & {
    handleIsOnScreen?: () => void;
  };

const getBackgroundImageByProps = (props: WorkoutCardProps) => {
  if (props.type === "warm-up") {
    return "url(/icons/warm-up-pattern.png)";
  } else if (props.type === "workout-result") {
    return "url(/icons/strength-or-skills-pattern.png)";
  }
};

export const WorkoutCard = (props: WorkoutCardProps) => {
  const getCurrentWorkout = () => {
    if (props.type === "warm-up" || props.type === "workout") {
      return props.workout;
    } else {
      return props.workoutResult.workout;
    }
  };

  const Container = ({ children }: { children: ReactNode }) => {
    return (
      <Card
        className={cn(
          "relative w-full",
          props.type === "warm-up" &&
            // "border-primary/10 bg-gradient-to-br from-primary/30 to-primary/20 dark:from-primary/40 dark:to-primary/30  dark:text-primary-foreground",
            "border-dashed text-muted-foreground ",
        )}
      >
        <div className="">{children}</div>
      </Card>
    );
  };

  const Header = () => {
    return (
      <CardHeader>
        {props.type === "workout-result" &&
          props.workoutResult.workout.difficulty && (
            <div
              className={cn(
                "absolute right-3 top-4 h-2 w-2 rounded-full border border-border",
                getColorByWorkoutType(props.workoutResult.workout.difficulty),
              )}
            />
          )}
        <CardTitle
          className={cn("", props.type !== "warm-up" && "flex flex-col gap-2")}
        >
          <div className="relative flex items-center gap-3.5 text-xl font-bold uppercase leading-none tracking-wider">
            {props.type == "warm-up" ? (
              <>Warm up</>
            ) : (
              <>
                {props.type === "workout" &&
                  (props.workout.name ??
                    enumToString(props.workout.elementType))}

                {props.type === "workout-result" &&
                  (props.workoutResult.workout.name ??
                    enumToString(props.workoutResult.workout.elementType))}
              </>
            )}
          </div>

          <div className="flex flex-col text-sm font-medium capitalize tracking-wider">
            {props.type === "workout-result" && (
              <div className="flex items-center gap-2.5 lowercase">
                <Clock size={16} />
                {`${getCurrentWorkout().totalTime}mn`}{" "}
                {enumToString(
                  props.workoutResult.workout.workoutType ?? "workout",
                )}
              </div>
            )}
            {(props.type === "warm-up" || props.type === "workout-result") &&
              props.workoutTime.startingTime &&
              props.workoutTime.endingTime && (
                <div className="flex items-center gap-2 pt-2 lowercase">
                  <CalendarClock size={16} />
                  <div className="flex items-center gap-1 text-xs">
                    <div className="rounded-full border border-foreground/[0.05] bg-muted px-2 py-[3px]">
                      {`${format(props.workoutTime.startingTime, "h:mm")}`}{" "}
                    </div>
                    <div className="h-[0.5] w-10 border border-dashed border-muted"></div>
                    <div className="rounded-full border border-foreground/[0.05] bg-muted px-2 py-[3px]">
                      {`${format(props.workoutTime.endingTime, "p")}`}{" "}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </CardTitle>

        {props.type !== "warm-up" && (props.actions ?? props.selection) && (
          <>
            <div className="absolute right-2 top-2 flex flex-col">
              {props.selection && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={props.selection.onWorkoutSelect}
                >
                  {props.selection.isSelected ? (
                    <CheckCircle size={16} />
                  ) : (
                    <Circle size={16} />
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </CardHeader>
    );
  };

  const Content = ({ children }: { children?: ReactNode }) => {
    return (
      <CardContent
        className={cn(
          "flex text-sm",
          props.type === "warm-up"
            ? "items-center gap-2.5"
            : "flex-col gap-1.5",
        )}
      >
        {children}
      </CardContent>
    );
  };

  const Footer = (props: WorkoutCardProps) => {
    if (props.type !== "warm-up") {
      return (
        <CardFooter className="flex flex-col">
          <div className="flex w-full justify-between">
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Heart className="fill-red-600" size={17} />
              </Button>
              {props.type === "workout-result" &&
                !isWorkoutResultFilled(props.workoutResult) && (
                  <Button
                    variant={"outline"}
                    className="flex w-full gap-2"
                    onClick={() => props.actions?.onShowResultForm?.()}
                  >
                    <FormInput size={20} />
                    Log your result
                  </Button>
                )}
              {/* <Button variant={"outline"} className="flex items-center gap-2">
              <Replace size={17} />
              Replace
            </Button> */}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical size={18} />
                </Button>
              </DropdownMenuTrigger>
              <WorkoutCardDropdown {...props} />
            </DropdownMenu>
          </div>

          {props.type === "workout-result" &&
            isWorkoutResultFilled(props.workoutResult) && (
              <div className="flex w-full flex-col">
                <div className="flex items-center py-6">
                  <Separator className="shrink" />
                  <div className="shrink-0 px-4 text-sm font-black tracking-wider">
                    THE OUTCOME
                  </div>
                  <Separator className="shrink" />
                </div>
                <div>
                  <WorkoutResultContent workoutResult={props.workoutResult} />
                </div>
              </div>
            )}
        </CardFooter>
      );
    }
  };

  return (
    <Container>
      <Header />

      <Content>
        <div className="whitespace-pre-wrap">
          {props.type !== "workout-result"
            ? props.workout.description
            : props.workoutResult.workout.description}
        </div>
      </Content>

      <Footer {...props} />
    </Container>
  );
};
