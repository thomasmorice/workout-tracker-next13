import WorkoutSessionPage from "./workout-session-page";
import {
  Page,
  PageContent,
  PageHeader,
} from "~/app/_components/layout/page-container";
import { api } from "~/trpc/server";

type PageProps = {
  params: {
    ["workout-session-id"]: string;
  };
};

export default async function WorkoutSession({ params }: PageProps) {
  const workoutSession = await api["workout-session"][
    "get-session-by-id"
  ].query({
    workoutSessionId: parseInt(params["workout-session-id"]),
  });

  if (!workoutSession) {
    return <div>Workout session not found</div>;
  }

  return (
    <>
      <Page>
        <PageHeader>Workout session</PageHeader>

        <PageContent className="flex h-full flex-col px-0">
          <WorkoutSessionPage workoutSession={workoutSession} />
        </PageContent>
      </Page>
    </>
  );
}
