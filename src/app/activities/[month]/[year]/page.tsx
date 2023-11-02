import {
  PageContent,
  PageHeader,
} from "~/app/_components/layout/page-container";
import { endOfMonth, parse, startOfMonth } from "date-fns";
import { api } from "~/trpc/server";
import ActivityView from "~/app/_components/activities/activity-view";

type PageProps = {
  params: {
    ["month"]: string;
    ["year"]: string;
  };
};

export default async function Activities({ params }: PageProps) {
  try {
    const year = parseInt(params.year);
    const month = parseInt(params.month);
    if (isNaN(year) || isNaN(month)) {
      throw "Invalid parameters";
    }
    const queryDate = parse(`01/${month}/${year}`, "d/MM/yyyy", new Date());
    if (!(queryDate instanceof Date)) {
      throw "Invalid Date";
    }

    const monthlyActivities = await api.event["get-events"].query({
      dateFilter: {
        lte: startOfMonth(queryDate),
        gte: endOfMonth(queryDate),
      },
    });

    return (
      <>
        <PageHeader>Activities</PageHeader>
        <PageContent className="flex justify-center">
          <ActivityView
            currentDate={queryDate}
            activities={monthlyActivities}
          />
        </PageContent>
      </>
    );
  } catch (error: unknown) {
    console.log("error", error);
    return (
      <>
        <PageHeader>Error</PageHeader>
        <PageContent>Please check console for errors</PageContent>
        {/* <PageContent className="flex">{error as string}</PageContent> */}
      </>
    );
  }
}
