import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";
import PageItemContainer from "@/ui/page-item-container";
import { IoMdTimer } from "react-icons/io";
import SetupJob from "./components/setup-job";

const LimitSettingsPage = () => {
  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Settings" },
        { name: "Limits", url: absoluteUrl("/settings/limits") },
      ]}
    >
      <div
        id="limitsettings"
        className="w-[99vw] h-[84vh] rounded-sm grid items-start gap-2 grid-cols-4"
      >
        <div className="group relative flex flex-col overflow-hidden rounded-md transition-all duration-200 ease-in-out hover:z-30 space-y-2">
          <PageItemContainer title="jobs" border>
            <div className="flex space-x-2 items-center text-sm">
              <IoMdTimer size={16} />
              <div>Job polling timings</div>
            </div>
            <SetupJob jobname={"Task"} />
            <SetupJob jobname={"Transaction"} />
          </PageItemContainer>
        </div>
      </div>
    </PageContent>
  );
};

export default LimitSettingsPage;
