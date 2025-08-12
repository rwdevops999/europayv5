import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";
import ValidationDialogTest from "./tests/validation-dialog-test";

export const dynamic = "force-dynamic";

const TestUI = () => {
  return (
    <PageContent
      data-testid="europay-tests-ui"
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Tests" },
        { name: "TestPage1", url: absoluteUrl("/tests/testui") },
      ]}
      className="border-1 border-blue-500"
    >
      <h1>TEST PAGE UI</h1>
      <ValidationDialogTest />
    </PageContent>
  );
};

export default TestUI;
