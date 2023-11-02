"use client";

import * as React from "react";
import { format, set } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "./input";
import { type ReactNode } from "react";
import { Calendar } from "./calendar";

type DatePickerProps = {
  children: ReactNode;
  onUpdate: (date: Date) => void;
  value: Date;
};

export function DatePicker({ children, value, onUpdate }: DatePickerProps) {
  const updateDate = (date?: Date) => {
    if (date) {
      onUpdate(
        set(date, {
          hours: value.getHours(),
          minutes: value.getMinutes(),
        }),
      );
    }
  };

  const updateTime = (time: string) => {
    onUpdate(
      set(value, {
        hours: parseInt(time.substring(0, 2)),
        minutes: parseInt(time.substring(3, 5)),
      }),
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={updateDate}
          initialFocus
        />
        <div className="flex items-center gap-3 px-4 pb-4">
          at{" "}
          <Input
            className="max-w-[110px]"
            defaultValue={format(value, "HH:mm")}
            onChange={(e) => updateTime(e.target.value)}
            type="time"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
