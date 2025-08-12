import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";

export const dynamic = "force-dynamic";

const TestPage1 = () => {
  return (
    <PageContent
      data-testid="europay-tests"
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Tests" },
        { name: "TestPage1", url: absoluteUrl("/tests/testpage1") },
      ]}
      className="border-1 border-blue-500"
    >
      <h1>TEST PAGE1</h1>
    </PageContent>
  );
};

export default TestPage1;
