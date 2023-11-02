import {
  type inferProcedureInput,
  type inferProcedureOutput,
} from "@trpc/server";
import { format } from "date-fns";
import { CalendarDays, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "~/app/_components/ui/button";
import { DatePicker } from "~/app/_components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "~/app/_components/ui/form";
import { type AppRouter } from "~/server/api/root";
import { cn } from "~/utils";

type WorkoutSessionActionBarProps = {
  workoutSession: NonNullable<
    inferProcedureOutput<AppRouter["workout-session"]["get-session-by-id"]>
  >;
};
type EventFormType = inferProcedureInput<AppRouter["event"]["edit-event"]>;

export default function WorkoutSessionActionBarProps({
  workoutSession,
}: WorkoutSessionActionBarProps) {
  const defaultValues: EventFormType = {
    id: workoutSession.event.id,
    date: workoutSession.event.eventDate,
  };
  const form = useForm<EventFormType>({
    defaultValues,
    mode: "onChange",
  });

  // add async again
  const onSubmit = (data: EventFormType) => {
    console.log("data", data);
  };

  form.watch("date");

  return (
    <Form {...form}>
      <form className="pb-2" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex w-full items-center justify-between rounded-xl bg-muted px-3 py-3">
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
                      <div className="flex items-center gap-2.5 text-sm font-medium text-foreground/80">
                        <CalendarDays
                          className="text-muted-foreground"
                          size={18}
                        />
                        {format(new Date(field.value), "PPPp")}
                      </div>
                    </DatePicker>
                  </FormControl>
                </FormItem>
              </>
            )}
          />
        </div>
        {form.formState.isDirty && (
          <div className="pt-3">
            <Button
              size="sm"
              variant="outline"
              className="flex w-full items-center gap-2.5"
            >
              <Save size={18} />
              Save pending changes
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
