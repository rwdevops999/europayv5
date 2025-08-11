import { absoluteUrl } from "@/lib/functions";
import PageContent from "@/ui/page-content";
import PageItemContainer from "@/ui/page-item-container";
import AppVersion from "./components/app-version";
import AppEnvironment from "./components/app-environement";
import AppInternet from "./components/app-internet";
import AppCountry from "./components/app-country";

const Dashboard = () => {
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
          <PageItemContainer border title="Environment">
            <AppEnvironment />
          </PageItemContainer>
          <PageItemContainer border title="Version">
            <AppVersion />
          </PageItemContainer>
          <PageItemContainer border title="Wifi">
            <AppInternet />
          </PageItemContainer>
        </div>
        <div className="group relative flex flex-col overflow-hidden rounded-md shadow transition-all duration-200 ease-in-out hover:z-30 space-y-2">
          <PageItemContainer border title="Country">
            <AppCountry />
          </PageItemContainer>
          {/* <PageItemContainer border title="Jobs">
            <AppJobs />
          </PageItemContainer> */}
        </div>
      </div>
    </PageContent>
  );
};

export default Dashboard;
