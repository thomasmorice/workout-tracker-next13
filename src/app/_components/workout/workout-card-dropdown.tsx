"use client";
import { Eye, Heart, Replace } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "../ui/dropdown-menu";

import { type WorkoutActions, type WorkoutType } from "./workout-card";
import { WorkoutSessionCardProps } from "~/app/activities/workout-session/[workout-session-id]/workout-session-page";

type WorkoutCardDropdownProps = (WorkoutSessionCardProps | WorkoutType) &
  WorkoutActions;

export default function WorkoutCardDropdown({
  actions,
  ...props
}: WorkoutCardDropdownProps) {
  if (!actions) {
    return;
  }
  return (
    <DropdownMenuContent side="left" className="min-w-[180px]">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem disabled>
          <Heart className="mr-2 fill-red-600 text-red-500" size={16} />
          <span>Add to favorite</span>
        </DropdownMenuItem>

        {actions.onShowDetails && (
          <DropdownMenuItem onClick={actions.onShowDetails}>
            <Eye className="mr-2" size={16} />
            <span>View details</span>
            <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {actions.onReplaceWorkout && (
          <DropdownMenuItem onClick={actions.onReplaceWorkout}>
            <Replace className="mr-2" size={16} />
            <span>Replace workout</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
