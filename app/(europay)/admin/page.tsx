import { absoluteUrl } from "@/lib/util";
import PageContent from "@/ui/page-content";

const AdminPage = () => {
  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Admin", url: absoluteUrl("/admin") },
      ]}
    >
      <div
        data-testid="admin"
        className="rounded-sm grid items-start gap-2 grid-cols-4"
      >
        <div className="col-span-2 group relative flex flex-col overflow-hidden rounded-md transition-all duration-200 ease-in-out hover:z-30 space-y-2">
          {/* <IamChart /> */}
        </div>
      </div>
    </PageContent>
  );
};

export default AdminPage;
