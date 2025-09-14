import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";
import TestOTPJobs from "./tests/testOTPJobs";
import CharsSplit from "./tests/chars-split";
import OtpJobHandling from "./tests/otp-job-handling";
import PaymentTest from "./tests/payment-test";
import TestSystemUser from "./tests/test-system-user";

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
      {/* <CharsSplit /> */}
      {/* <TestOTPJobs /> */}
      {/* <CreateOtp /> */}
      {/* <OtpJobHandling /> */}
      {/* <PaymentTest /> */}
      <TestSystemUser />
    </PageContent>
  );
};

export default TestPage1;
