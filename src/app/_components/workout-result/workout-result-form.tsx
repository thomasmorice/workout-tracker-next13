import {
  type inferProcedureInput,
  type inferProcedureOutput,
} from "@trpc/server";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Angry, Frown, Meh, PartyPopper, Smile } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { useEffect, useState } from "react";
import { isWorkoutResultFilled } from "~/utils/workout-session-utils";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

type WorkoutResultFormProps = {
  workoutResult: NonNullable<
    inferProcedureOutput<AppRouter["workout-session"]["get-session-by-id"]>
  >["workoutResult"][number];
};

export default function WorkoutResultForm({
  workoutResult,
}: WorkoutResultFormProps) {
  const defaultValues: Partial<WorkoutResultFormValues> = workoutResult;
  const [forTimeFinished, set_forTimeFinished] = useState(
    !!workoutResult.time ?? false,
  );
  const { mutateAsync: addOrEditResult } = api["workout-result"][
    "add-or-edit"
  ].useMutation({
    onError(e: unknown) {
      console.log("error", e);
    },
  });

  type WorkoutResultFormValues = inferProcedureInput<
    AppRouter["workout-result"]["add-or-edit"]
  >;

  const form = useForm<WorkoutResultFormValues>({
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: WorkoutResultFormValues) => {
    await addOrEditResult(data);
  };

  const [resultTotalTimeMn, set_resultTotalTimeMn] = useState(
    workoutResult.time ? Math.floor(workoutResult.time / 60) : null,
  );
  const [resultTotalTimeSec, set_resultTotalTimeSec] = useState(
    workoutResult.time ? workoutResult.time % 60 : null,
  );

  useEffect(() => {
    if (resultTotalTimeMn) {
      form.setValue("time", resultTotalTimeMn * 60 + (resultTotalTimeSec ?? 0));
    }
  }, [resultTotalTimeMn, resultTotalTimeSec]);

  return (
    <div className="h-full overflow-y-scroll px-4">
      <div className="pb-6">
        <Textarea
          disabled
          className="text-xs"
          value={workoutResult.workout.description}
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <h3 className="py-3 text-xl font-bold">How was this workout?</h3>
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Overall feeling</FormLabel>
                <FormDescription>
                  How did you feel overall about doing this workout?
                </FormDescription>
                <FormMessage />
                <RadioGroup
                  onValueChange={(val) => field.onChange(parseInt(val))}
                  defaultValue={`${field.value}`}
                  className="flex flex-wrap justify-start gap-2 pt-2"
                >
                  {Array.from({ length: 5 }, (_i, i) => (
                    <FormItem key={i}>
                      <FormLabel className="group relative [&:has([data-state=checked])>div]:border-slate-300 [&:has([data-state=checked])>div]:text-slate-300">
                        <FormControl>
                          <RadioGroupItem
                            value={`${i + 1}`}
                            className="sr-only"
                          />
                        </FormControl>
                        <div className="flex items-center justify-center rounded-md border-2 border-foreground/0 p-2 text-foreground/70 hover:border-accent ">
                          {
                            {
                              0: <Angry />,
                              1: <Frown />,
                              2: <Meh />,
                              3: <Smile />,
                              4: <PartyPopper />,
                            }[i]
                          }
                        </div>
                        <span
                          className={`flex w-full items-center justify-center p-1.5 text-foreground/80`}
                        >
                          {i === 0 && "Awful"}
                          {i === 1 && "Bad"}
                          {i === 2 && "Okay"}
                          {i === 3 && "Good"}
                          {i === 4 && "Yay!"}
                        </span>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="isRx"
              render={({ field }) => (
                <FormItem className="">
                  {/* <FormLabel>Is RX</FormLabel> */}
                  <div className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="leading-none">
                      <FormLabel>Have you done this workout RX?</FormLabel>
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shouldRecommendWorkoutAgain"
              render={({ field }) => (
                <FormItem className="">
                  {/* <FormLabel>Should we recommend that workout again</FormLabel> */}
                  <div className="flex flex-row space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="leading-none">
                      <FormLabel>
                        Should we recommend that workout again?
                      </FormLabel>
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-lg font-medium">Result section</h3>
              <p className="text-sm text-slate-300/60">
                This is where you add your result that will then be useful to
                track your progress and reach your goals
              </p>
            </div>
            <div>
              {workoutResult.workout.workoutType === "FOR_TIME" && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="on-time"
                    checked={forTimeFinished}
                    onCheckedChange={set_forTimeFinished}
                  />
                  <Label htmlFor="on-time">Finished on time</Label>
                </div>
              )}
            </div>

            {workoutResult.workout.workoutType === "FOR_TIME" &&
              forTimeFinished && (
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total time for the workout</FormLabel>
                      <div className="flex gap-5">
                        <FormControl>
                          <div className="relative flex gap-1">
                            <Input
                              {...field}
                              value={resultTotalTimeMn ?? ""}
                              onChange={(e) =>
                                set_resultTotalTimeMn(parseInt(e.target.value))
                              }
                              type="number"
                              placeholder="8"
                              className="max-w-[70px]"
                            />
                            <div className=" flex items-center text-sm">MN</div>
                          </div>
                        </FormControl>
                        <FormControl>
                          <div className="relative flex gap-1">
                            <Input
                              {...field}
                              value={resultTotalTimeSec ?? ""}
                              onChange={(e) =>
                                set_resultTotalTimeSec(parseInt(e.target.value))
                              }
                              type="number"
                              placeholder="16"
                              className="max-w-[70px]"
                            />
                            <div className=" flex items-center text-sm">
                              SEC
                            </div>
                          </div>
                        </FormControl>
                      </div>
                      <FormDescription>
                        How many time did it take to finish this workout
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

            {(workoutResult.workout.workoutType === "AMRAP" ||
              (workoutResult.workout.workoutType === "FOR_TIME" &&
                !forTimeFinished)) && (
              <FormField
                control={form.control}
                name="totalReps"
                render={({ field }) => (
                  <>
                    <FormItem>
                      <FormLabel>Number of repetitions</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ""}
                          type="number"
                          placeholder="120"
                        />
                      </FormControl>
                      <FormDescription>
                        {`Add the number of repetitions you've done on this workout`}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
            )}

            {(workoutResult.workout.workoutType === "ONE_REP_MAX" ||
              workoutResult.workout.workoutType === "X_REP_MAX") && (
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <>
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <div className="relative flex gap-1">
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            type="number"
                            placeholder="110"
                          />
                          <div className=" flex items-center text-sm">KG</div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        How many kilos did you end up with?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional information</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="It was pretty intense and I felt..."
                      className="resize-none"
                      value={field.value ?? ""}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="pt-3">
            <Button disabled={!form.formState.isDirty} type="submit">
              {`${
                isWorkoutResultFilled(workoutResult) ? "Update" : "Create"
              } result`}{" "}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
