import ActivityView from "~/app/_components/activities/activity-view";
import {
  PageContent,
  PageHeader,
} from "~/app/_components/layout/page-container";

export default function Activities() {
  return (
    <>
      <PageHeader>Activities</PageHeader>
      <PageContent className="flex justify-center">
        <ActivityView />
      </PageContent>
    </>
  );
}
