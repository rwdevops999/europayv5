import { loadPolicies } from "@/app/server/policies";
import { loadRoles } from "@/app/server/roles";
import { loadServices } from "@/app/server/services";
import { absoluteUrl } from "@/lib/util";
import { tPolicy, tRole, tService } from "@/lib/prisma-types";
import PageContent from "@/ui/page-content";
import RoleHandler from "./role-handler";
import { NOOP } from "@/lib/constants";

const IamRolesPage = async ({ params }: { params: Promise<any> }) => {
  let services: tService[] = [];
  let roles: tRole[] = [];
  let policies: tPolicy[] = [];

  let roleId: number | undefined;

  /**
   * retrieve the policyId, then load all services and all service statements.
   */
  await params.then(async (value: any) => {
    roleId = value;

    await loadServices()
      .then(async (values: tService[]) => {
        services = values;
        await loadRoles().then(async (values: tRole[]) => {
          roles = values;
          await loadPolicies().then((values: tPolicy[]) => (policies = values));
        });
      })
      .catch(NOOP);
  });

  /**
   * call the role handler (which provides the UI for handling the roles)
   */
  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "IAM" },
        { name: "Roles", url: absoluteUrl("/iam/roles/id") },
      ]}
    >
      <RoleHandler roleid={roleId} roles={roles} policies={policies} />
    </PageContent>
  );
};

export default IamRolesPage;
