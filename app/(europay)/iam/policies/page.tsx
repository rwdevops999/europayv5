import { loadPolicies } from "@/app/server/policies";
import { loadServiceStatements } from "@/app/server/service-statements";
import { loadServices } from "@/app/server/services";
import { absoluteUrl } from "@/lib/util";
import { tPolicy, tService, tServiceStatement } from "@/lib/prisma-types";
import PageContent from "@/ui/page-content";
import PolicyHandler from "./policy-handler";
import { NOOP } from "@/lib/constants";

const IamPoliciesPage = async ({ params }: { params: Promise<any[]> }) => {
  let services: tService[] = [];
  let policies: tPolicy[] = [];
  let servicestatements: tServiceStatement[] = [];

  let policyId: number | undefined;
  let serviceId: number | undefined;

  /**
   * retrieve the policyId, then load all services and all service statements.
   */
  await params.then(async (value: any[]) => {
    policyId = value[0];
    serviceId = value[1];

    await loadServices()
      .then(async (values: tService[]) => {
        services = values;
        await loadPolicies().then(async (values: tPolicy[]) => {
          policies = values;
          await loadServiceStatements().then(
            (values: tServiceStatement[]) => (servicestatements = values)
          );
        });
      })
      .catch(NOOP);
  });

  /**
   * call the policy handler (which provides the UI for handling the policies)
   */
  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "IAM" },
        { name: "Policies", url: absoluteUrl("/iam/policies/id") },
      ]}
    >
      <PolicyHandler
        serviceid={serviceId}
        policyid={policyId}
        policies={policies}
        services={services}
        servicestatements={servicestatements}
      />
    </PageContent>
  );
};

export default IamPoliciesPage;
