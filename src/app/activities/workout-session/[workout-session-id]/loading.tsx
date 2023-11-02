import {
  Page,
  PageContent,
  PageHeader,
} from "~/app/_components/layout/page-container";
import { Skeleton } from "~/app/_components/ui/skeleton";

export default function Loading() {
  return (
    <Page>
      <PageHeader>Workout session</PageHeader>

      <PageContent className="flex flex-col gap-y-6">
        {Array.from({ length: 10 }, (_i, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </PageContent>
    </Page>
  );
}
