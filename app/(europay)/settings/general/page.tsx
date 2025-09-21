"use client";

import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";
import PageItemContainer from "@/ui/page-item-container";
import SetupOTP from "./components/setup-otp";
import { useUser } from "@/hooks/use-user";
import { $iam_user_has_action } from "@/app/client/iam-access";

const GeneralSettingsPage = () => {
  const { user } = useUser();

  const showOTPSection: boolean = $iam_user_has_action(
    user,
    "europay:settings:general",
    "View OTP"
  );

  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Settings" },
        { name: "General", url: absoluteUrl("/settings/general") },
      ]}
    >
      <div
        id="generalsettings"
        className="w-[99vw] h-[84vh] rounded-sm grid items-start gap-2 grid-cols-4"
      >
        <div className="group relative flex flex-col overflow-hidden rounded-md transition-all duration-200 ease-in-out hover:z-30 space-y-2">
          <PageItemContainer title="otp" border>
            <SetupOTP />
          </PageItemContainer>
        </div>
      </div>
    </PageContent>
  );
};

export default GeneralSettingsPage;
