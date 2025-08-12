import { loadServices } from "@/app/server/services";
import { absoluteUrl } from "@/lib/util";
import { tService } from "@/lib/prisma-types";
import PageContent from "@/ui/page-content";
import ServiceHandler from "./service-handler";

const IamServicesPage = async ({
  params,
}: {
  params: Promise<number | undefined>;
}) => {
  const serviceId = await params;

  let services: tService[] = [];

  await loadServices().then((values: tService[]) => {
    services = values;
  });

  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "IAM" },
        { name: "Services", url: absoluteUrl("/iam/services/id") },
      ]}
    >
      <ServiceHandler serviceId={serviceId} services={services} />
    </PageContent>
  );
};

export default IamServicesPage;
