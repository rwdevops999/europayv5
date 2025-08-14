import PageContent from "@/ui/page-content";
import SetupDatabase from "./components/setup-database";
import SetupSelective from "./components/setup-selective";
import { absoluteUrl } from "@/lib/util";
import PageItemContainer from "@/ui/page-item-container";

const StorageSettingsPage = () => {
  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Settings" },
        { name: "Storage", url: absoluteUrl("/settings/storage") },
      ]}
    >
      <div
        id="storagesettings"
        className="w-[99vw] h-[84vh] rounded-sm grid items-start gap-2 grid-cols-4"
      >
        <PageItemContainer title="database" border>
          <SetupDatabase />
        </PageItemContainer>

        <PageItemContainer title="selective" border>
          <SetupSelective />
        </PageItemContainer>
      </div>
    </PageContent>
  );
};

export default StorageSettingsPage;
