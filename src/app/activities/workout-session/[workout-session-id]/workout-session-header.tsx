"use client";
import { Edit, Save } from "lucide-react";
import {
  type inferProcedureInput,
  type inferProcedureOutput,
} from "@trpc/server";

import { format } from "date-fns";
import { cn } from "~/utils";
import { Button } from "~/app/_components/ui/button";
import { DatePicker } from "~/app/_components/ui/date-picker";

import { type AppRouter } from "~/server/api/root";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
} from "~/app/_components/ui/form";
import { useForm } from "react-hook-form";

type WorkoutSessionHeaderProps = {
  workoutSession: NonNullable<
    inferProcedureOutput<AppRouter["workout-session"]["get-session-by-id"]>
  >;
};

type EventFormType = inferProcedureInput<AppRouter["event"]["edit-event"]>;

export default function WorkoutSessionHeader({
  workoutSession,
}: WorkoutSessionHeaderProps) {
  const defaultValues: EventFormType = {
    id: workoutSession.event.id,
    date: workoutSession.event.eventDate,
  };
  const headerHeight = "14rem";
  const bottomPadding = "1rem";
  const form = useForm<EventFormType>({
    defaultValues,
    mode: "onChange",
  });

  // put async back
  const onSubmit = (data: EventFormType) => {
    console.log("data", data);
  };

  form.watch("date");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          style={{
            // height: headerHeight,
            marginBottom: `-${bottomPadding}`,
          }}
          className="flex flex-col items-center "
        >
          <div
            style={
              {
                // height: headerHeight,
              }
            }
            className={`relative h-56  w-full`}
          >
            <div
              style={{
                backgroundImage: "url(/workout-session-bg.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                // "linear-gradient(to bottom, #000, transparent) top/100% 16px no-repeat, linear-gradient(to top, #000, transparent) bottom/100% 128px no-repeat, url(/workout-session-bg-2.png) center/cover no-repeat",
              }}
              // alt="workout session header"
              className="absolute inset-0  opacity-20"
            />

            <div
              style={
                {
                  // paddingBottom: bottomPadding,
                }
              }
              className={cn(
                "relative flex h-full flex-col justify-center pl-6",
              )}
            >
              <div className="flex flex-col gap-2">
                <div>
                  <div className=" flex gap-x-3">
                    <div className="text-6xl font-bold leading-none">
                      {format(new Date(form.getValues("date")), "dd")}
                    </div>
                    <div className="relative flex flex-col pt-0.5">
                      <div className="flex items-center text-3xl font-medium leading-none">
                        {format(new Date(form.getValues("date")), "eeee")}
                      </div>
                      <div className="text-base leading-none tracking-wider">
                        {format(new Date(form.getValues("date")), "MMMM")}{" "}
                        {format(new Date(form.getValues("date")), "yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 tracking-tight">
                    Starting at
                    <div className="font-bold">
                      {format(new Date(new Date(form.getValues("date"))), "p")}
                    </div>
                    {/* until ~
                    <div className="font-bold">
                      {format(new Date(new Date(form.getValues("date"))), "p")}
                    </div> */}
                  </div>
                </div>
                <div className="flex items-center gap-2  text-xs">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <>
                        <FormItem>
                          <FormControl>
                            <DatePicker
                              value={new Date(field.value)}
                              onUpdate={field.onChange}
                            >
                              <Button
                                variant={"outline"}
                                size="sm"
                                className="flex  w-fit items-center gap-2"
                              >
                                <Edit size={16} />
                                Edit date and time
                              </Button>
                            </DatePicker>
                          </FormControl>
                        </FormItem>
                      </>
                    )}
                  />
                  {form.formState.isDirty && (
                    <Button
                      variant={"default"}
                      size="sm"
                      type="submit"
                      className="flex  w-fit items-center gap-2"
                    >
                      <Save size={16} />
                      Save changes
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
