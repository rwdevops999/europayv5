import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";
import CronTest from "./tests/cron-test";
import JobTest from "./tests/job-test";

export const dynamic = "force-dynamic";

const TestJobs = () => {
  return (
    <PageContent
      data-testid="europay-tests"
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Tests" },
        { name: "TestJobs", url: absoluteUrl("/tests/testjobs") },
      ]}
      className="border-1 border-blue-500"
    >
      <CronTest />
      {/* <JobTest /> */}
    </PageContent>
  );
};

export default TestJobs;
