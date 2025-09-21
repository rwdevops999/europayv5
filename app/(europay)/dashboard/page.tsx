"use client";

import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";
import PageItemContainer from "@/ui/page-item-container";
import AppVersion from "./components/app-version";
import AppEnvironment from "./components/app-environement";
import AppInternet from "./components/app-internet";
import AppCountry from "./components/app-country";
import { $iam_user_has_action } from "@/app/client/iam-access";
import { useUser } from "@/hooks/use-user";

const Dashboard = () => {
  const { user } = useUser();

  const hasAccess = (_component: string): boolean => {
    return $iam_user_has_action(user, "europay:dashboard", _component, true);
  };

  const canChangeCountry: boolean = $iam_user_has_action(
    user,
    "europay:dashboard:country",
    "Change",
    true
  );

  const environmentVisible: boolean = hasAccess("Environment");
  const versionVisible: boolean = hasAccess("Version");
  const wifiVisible: boolean = hasAccess("Wifi");
  const countryVisible: boolean = hasAccess("Country");

  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Dashboard", url: absoluteUrl("/dashboard") },
      ]}
    >
      <div
        data-testid="dashboard"
        className="rounded-sm grid items-start gap-2 grid-cols-4"
      >
        <div className="group relative flex flex-col overflow-hidden rounded-md shadow transition-all duration-200 ease-in-out hover:z-30 space-y-2">
          {environmentVisible && (
            <PageItemContainer border title="Environment">
              <AppEnvironment />
            </PageItemContainer>
          )}
          {versionVisible && (
            <PageItemContainer border title="Version">
              <AppVersion />
            </PageItemContainer>
          )}
          {wifiVisible && (
            <PageItemContainer border title="Wifi">
              <AppInternet />
            </PageItemContainer>
          )}
        </div>
        <div className="group relative flex flex-col overflow-hidden rounded-md shadow transition-all duration-200 ease-in-out hover:z-30 space-y-2">
          {countryVisible && (
            <PageItemContainer border title="Country">
              <AppCountry canChange={canChangeCountry} />
            </PageItemContainer>
          )}
          {/* <PageItemContainer border title="Jobs">
            <AppJobs />
          </PageItemContainer> */}
        </div>
      </div>
    </PageContent>
  );
};

export default Dashboard;
