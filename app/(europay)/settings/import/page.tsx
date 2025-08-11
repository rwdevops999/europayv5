import PageContent from "@/ui/page-content";
import ImportIam from "./components/import-iam";
import { absoluteUrl } from "@/lib/functions";
import PageItemContainer from "@/ui/page-item-container";

const Import = () => {
  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Settings" },
        { name: "Import", url: absoluteUrl("/settings/import") },
      ]}
    >
      <div
        id="storagesettings"
        className="w-[99vw] h-[84vh] rounded-sm grid items-start grid-cols-4 gap-x-2"
      >
        <div className="group relative flex flex-col overflow-hidden rounded-md shadow transition-all duration-200 ease-in-out hover:z-30 space-y-2">
          {/* <PageItemContainer title="countries" border>
            <ImportCountries />
          </PageItemContainer>
          <PageItemContainer title="templates">
            <ImportTemplates />
          </PageItemContainer> */}
        </div>
        <div className="group relative flex flex-col overflow-hidden rounded-md shadow transition-all duration-200 ease-in-out hover:z-30 space-y-2">
          <PageItemContainer title="IAM" border>
            <ImportIam />
          </PageItemContainer>
        </div>
      </div>
    </PageContent>
  );
};

export default Import;
