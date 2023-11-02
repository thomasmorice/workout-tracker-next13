import { api } from "~/trpc/server";
import {
  Page,
  PageContent,
  PageHeader,
} from "./_components/layout/page-container";
import { getServerAuthSession } from "~/server/auth";
import Dashboard from "./_components/dashboard";

export default async function Home() {
  const session = await getServerAuthSession();

  let nextSessions, totalSessions;
  try {
    totalSessions = await api["workout-session"]["get-total-sessions"].query();
    nextSessions = await api["workout-session"]["get-next-sessions"].query();
  } catch (error) {
    console.log("error", error);
  }
  const isSignedIn = session?.user;

  return (
    <>
      <Page>
        <PageHeader>{isSignedIn ? "Dashboard" : "Box Tracker"}</PageHeader>
        {isSignedIn && totalSessions ? (
          <PageContent>
            <Dashboard
              totalSessions={totalSessions}
              nextSessions={nextSessions}
            />
          </PageContent>
        ) : (
          <PageContent className="px-0">
            <p className="px-3 pb-8 pt-3">
              Welcome to Box Track, your ultimate workout tracking companion!{" "}
              With our app, you&apos;ll have the tools you need to track your
              progress and set new personal records. With each workout you log,
              you&apos;ll be able to see how far you&apos;ve come and how much
              stronger you&apos;ve become. <br />
              Our easy-to-use interface and interactive features make tracking
              your workouts fun and engaging. From logging your sets and reps to
              setting reminders and tracking your PRs, we&apos;ve got you
              covered.
            </p>
            <p className="bg-secondary-foreground text-secondary  px-3  py-8">
              With Box Track, you&apos;ll be able to see your improvements in
              real-time, setting new goals and pushing yourself further. Whether
              you&apos;re a beginner or a seasoned pro, our app is designed to
              help you reach your fitness goals.
            </p>
            <p className="px-3  py-8">
              So why wait? Start using Box Track now and start your journey to a
              stronger, healthier you! With Box Track you can also customize
              your workout plan, compare your performance with other users, and
              get personalized tips and advice from our fitness experts. With
              Box Track, the sky is the limit!
            </p>
          </PageContent>
        )}
      </Page>
    </>
  );
}
