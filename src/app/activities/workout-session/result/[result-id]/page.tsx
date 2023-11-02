import {
  Page,
  PageContent,
  PageHeader,
} from "~/app/_components/layout/page-container";
import { getServerSession } from "next-auth";
import Image from "next/image";

import { Button } from "~/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/app/_components/ui/card";

type PageProps = {
  params: {
    ["result-id"]: string;
  };
};

export default async function WorkoutSession({ params }: PageProps) {
  const session = await getServerSession();

  // const workoutSession = await serverClient.workoutSession.getSessionById({
  //   workoutSessionId: parseInt(params["workout-session-id"]),
  // });

  // const WARMUP_TIME = 12; // 12 minutes are considered for a warm up
  // const TIME_BETWEEN_ELEMENTS = 8; // 6 minutes are considered between each elements
  // const isSignedIn = session?.user;

  // const startingTime = new Date(workoutSession.event.eventDate);
  // const warmUpEndTime = add(startingTime, {
  //   minutes: WARMUP_TIME,
  // });
  // let workoutStartingTime = add(warmUpEndTime, {
  //   minutes: TIME_BETWEEN_ELEMENTS,
  // });
  // let currentEndTime: Date;

  return (
    <>
      <Page>
        <PageHeader>Workout session</PageHeader>

        <PageContent className="flex flex-col">
          <div className="relative h-40">
            <div className="fixed left-0 -z-10 flex w-full">
              <Image
                alt="workout session header"
                className="absolute inset-0 -z-10 opacity-50"
                layout="fill"
                objectFit="cover"
                src="/workout-session-bg.jpg"
              />
            </div>
          </div>

          <div className="-mt-6 flex gap-x-3">
            <Card>
              <CardHeader>Example workout blabla</CardHeader>
              <CardContent>Worout description</CardContent>
              <CardFooter>
                <Button>Do this</Button> <Button>Do that</Button>
              </CardFooter>
            </Card>
          </div>
        </PageContent>
      </Page>
    </>
  );
}
