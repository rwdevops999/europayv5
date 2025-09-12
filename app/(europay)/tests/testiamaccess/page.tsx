import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";
import TestUserWithPolicy from "./tests/test-user-with-policy";
import AddUserToGroup from "./tests/add-user-to-group";
import UploadManaged from "./tests/upload-managed";

export const dynamic = "force-dynamic";

const TestIamAccess = () => {
  return (
    <PageContent
      data-testid="europay-tests"
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Tests" },
        { name: "TestIamAccess", url: absoluteUrl("/tests/testiamaccess") },
      ]}
      className="border-1 border-blue-500"
    >
      {/* <TestUserWithPolicy /> */}
      {/* <AddUserToGroup /> */}
      <UploadManaged />
    </PageContent>
  );
};

export default TestIamAccess;
