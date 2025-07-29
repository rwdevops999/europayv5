import { absoluteUrl } from "@/lib/functions";
import PageContent from "@/ui/page-content";

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
        <div className="group relative flex flex-col overflow-hidden rounded-md shadow transition-all duration-200 ease-in-out hover:z-30 space-y-2"></div>
        DASHBOARD
      </div>
    </PageContent>
  );
};

export default Dashboard;
