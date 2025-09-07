import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";
import CronTest from "./tests/cron-test";

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
      {/* <TestUserWithPolicy /> */}
      {/* <AddUserToGroup /> */}
      <CronTest />
    </PageContent>
  );
};

export default TestJobs;
