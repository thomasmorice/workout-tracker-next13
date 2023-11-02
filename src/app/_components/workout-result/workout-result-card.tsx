import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar, Flame, MoreVertical } from "lucide-react";
import { hasBenchmarkeableResult } from "~/utils/workout-session-utils";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import WorkoutResultDropdown from "./workout-result-dropdown";
import { type WorkoutResult } from "~/app/activities/workout-session/[workout-session-id]/workout-session-page";
import { secondsToMinutesAndSeconds } from "~/utils";

type WorkoutResultCardProps = {
  workoutResult: WorkoutResult;
  eventDate?: Date;
  onEditWorkoutResult: (result: WorkoutResult) => void;
};

const WorkoutResultHeader = ({
  workoutResult,
  onEditWorkoutResult,
  eventDate,
}: WorkoutResultCardProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        {hasBenchmarkeableResult(workoutResult) ? (
          <div>
            {workoutResult.totalReps &&
              `${workoutResult.totalReps} repetitions`}
            {workoutResult.time &&
              `${secondsToMinutesAndSeconds(workoutResult.time).minutes}:${
                secondsToMinutesAndSeconds(workoutResult.time).seconds
              } mn`}
            {workoutResult.weight && `${workoutResult.weight}KG`}
          </div>
        ) : (
          <div className="">Plain result</div>
        )}
      </div>
      {eventDate && (
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} />
          {format(eventDate, "EEEE, MMMM dd 'at' p")}
        </div>
      )}
    </div>
  );
};

const WorkoutResultContent = ({
  workoutResult,
}: Pick<WorkoutResultCardProps, "workoutResult">) => {
  return (
    <>
      <div className="flex items-center gap-5">
        <div className="flex gap-0.5">
          {[...Array(workoutResult.rating)].map((_i, i) => (
            <Flame key={i} size={20} className="fill-red-400" />
          ))}
        </div>
        <div>
          <Badge> {workoutResult.isRx ? "RX" : "Scaled"}</Badge>
        </div>
      </div>
      <div className="whitespace-pre-wrap pt-2">
        {workoutResult.description}
      </div>
    </>
  );
};

// export default function WorkoutResultCard({
//   workoutResult,
//   onEditWorkoutResult,
//   eventDate,
// }: WorkoutResultCardProps) {
//   return (
//     <Card className="relative">
//       <CardHeader>
//         <div className="absolute right-2 top-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="icon">
//                 <MoreVertical size={18} />
//               </Button>
//             </DropdownMenuTrigger>
//             <WorkoutResultDropdown
//               onEditResult={() => onEditWorkoutResult(workoutResult)}
//               onDeleteResult={() => console.log("delete")}
//             />
//           </DropdownMenu>
//         </div>
//         <CardTitle>
//           <div className="flex flex-col gap-1.5">
//             <div className="flex items-center justify-between">
//               {hasBenchmarkeableResult(workoutResult) ? (
//                 <div>
//                   {workoutResult.totalReps &&
//                     `${workoutResult.totalReps} repetitions`}
//                   {workoutResult.time &&
//                     `${
//                       secondsToMinutesAndSeconds(workoutResult.time).minutes
//                     }:${
//                       secondsToMinutesAndSeconds(workoutResult.time).seconds
//                     } mn`}
//                   {workoutResult.weight && `${workoutResult.weight}KG`}
//                 </div>
//               ) : (
//                 <div className="">Plain result</div>
//               )}
//             </div>
//             {eventDate && (
//               <div className="flex items-center gap-2 text-sm">
//                 <Calendar size={16} />
//                 {format(eventDate, "EEEE, MMMM dd 'at' p")}
//               </div>
//             )}
//           </div>
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="flex items-center gap-5">
//           <div className="flex gap-0.5">
//             {[...Array(workoutResult.rating)].map((_i, i) => (
//               <Flame key={i} size={20} className="fill-red-400" />
//             ))}
//           </div>
//           <div>
//             <Badge> {workoutResult.isRx ? "RX" : "Scaled"}</Badge>
//           </div>
//         </div>
//         <div className="pt-2">{workoutResult.description}</div>
//       </CardContent>
//     </Card>
//   );
// }

export { WorkoutResultHeader, WorkoutResultContent };
