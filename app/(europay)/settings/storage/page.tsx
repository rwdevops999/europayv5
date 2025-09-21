"use client";

import PageContent from "@/ui/page-content";
import SetupDatabase from "./components/setup-database";
import SetupSelective from "./components/setup-selective";
import { absoluteUrl } from "@/lib/util";
import PageItemContainer from "@/ui/page-item-container";
import { useUser } from "@/hooks/use-user";
import { $iam_user_has_action } from "@/app/client/iam-access";

const StorageSettingsPage = () => {
  const { user } = useUser();

  const showDatabaseSection: boolean = $iam_user_has_action(
    user,
    "europay:settings:storage",
    "View Database"
  );
  const showTablesSection: boolean = $iam_user_has_action(
    user,
    "europay:settings:storage",
    "View Selective"
  );

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
        {showDatabaseSection && (
          <PageItemContainer title="database" border>
            <SetupDatabase />
          </PageItemContainer>
        )}

        {showTablesSection && (
          <PageItemContainer title="tables" border>
            <SetupSelective />
          </PageItemContainer>
        )}
      </div>
    </PageContent>
  );
};

export default StorageSettingsPage;
