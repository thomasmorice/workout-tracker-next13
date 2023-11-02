"use client";
import { Delete, FormInput } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
} from "~/app/_components/ui/dropdown-menu";

type WorkoutResultDropdownProps = {
  onEditResult?: () => void;
  onDeleteResult?: () => void;
};

export default function WorkoutResultDropdown({
  onEditResult,
  onDeleteResult,
  ...props
}: WorkoutResultDropdownProps) {
  return (
    <DropdownMenuContent side="left" className="min-w-[180px]">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      {onEditResult && (
        <DropdownMenuItem onClick={onEditResult}>
          <FormInput className="mr-2" size={16} />
          <span>Edit result</span>
          <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
        </DropdownMenuItem>
      )}
      <DropdownMenuGroup>
        {onDeleteResult && (
          <DropdownMenuItem onClick={onDeleteResult}>
            <Delete className="mr-2" size={16} />
            <span>Delete result</span>
            <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
