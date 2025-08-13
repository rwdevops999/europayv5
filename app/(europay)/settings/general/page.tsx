import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";
import PageItemContainer from "@/ui/page-item-container";
import SetupToast from "./components/setup-toast";
import SetupHistory from "./components/setup-history";
import SetupMarkdown from "./components/setup-markdown";
import SetupOTP from "./components/setup-otp";

const GeneralSettingsPage = () => {
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
          <PageItemContainer title="toast" border>
            <SetupToast />
          </PageItemContainer>
          <PageItemContainer title="history" border>
            <SetupHistory />
          </PageItemContainer>
          <PageItemContainer title="otp" border>
            <SetupOTP />
          </PageItemContainer>
          <PageItemContainer title="markdown" border>
            <SetupMarkdown />
          </PageItemContainer>
        </div>
      </div>
    </PageContent>
  );
};

export default GeneralSettingsPage;
