import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";
import TestSockets from "./tests/test-sockets";

export const dynamic = "force-dynamic";

const TestSocket = () => {
  return (
    <PageContent
      data-testid="europay-tests-socket"
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Tests" },
        { name: "TestPage1", url: absoluteUrl("/tests/testsocket") },
      ]}
      className="border-1 border-blue-500"
    >
      <h1>TEST PAGE SOCKET</h1>
      <TestSockets setup={true} />
    </PageContent>
  );
};

export default TestSocket;
