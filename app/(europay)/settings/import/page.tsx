"use client";

import PageContent from "@/ui/page-content";
import ImportIam from "./components/import-iam";
import { absoluteUrl } from "@/lib/util";
import PageItemContainer from "@/ui/page-item-container";
import { $iam_user_has_action } from "@/app/client/iam-access";
import { useUser } from "@/hooks/use-user";

const Import = () => {
  const { user } = useUser();

  const showImportIAM: boolean = $iam_user_has_action(
    user,
    "europay:settings:import",
    "Import IAM Section"
  );

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
          {showImportIAM && (
            <PageItemContainer title="import IAM" border>
              <ImportIam />
            </PageItemContainer>
          )}
        </div>
        <div className="group relative flex flex-col overflow-hidden rounded-md shadow transition-all duration-200 ease-in-out hover:z-30 space-y-2"></div>
      </div>
    </PageContent>
  );
};

export default Import;
