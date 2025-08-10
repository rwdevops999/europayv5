import { tCountry, tGroup, tPolicy, tRole, tUser } from "@/lib/prisma-types";
import UserHandler from "./user-handler";
import { loadCountries } from "@/app/server/country";
import { loadPolicies } from "@/app/server/policies";
import { loadRoles } from "@/app/server/roles";
import { loadUserById, loadUsers } from "@/app/server/users";
import PageContent from "@/ui/page-content";
import { absoluteUrl } from "@/lib/functions";
import { loadGroups } from "@/app/server/groups";
import { Group } from "@/generated/prisma";

const IamUsersPage = async ({ params }: { params: Promise<any> }) => {
  let userId: number | undefined;

  let users: tUser[] = [];
  let policies: tPolicy[] = [];
  let roles: tRole[] = [];
  let groups: tGroup[] = [];
  let countries: tCountry[] = [];

  let linkedPolicies: number[] = [];
  let linkedRoles: number[] = [];
  let linkedGroups: number[] = [];

  const loadAdditionalData = async (): Promise<void> => {
    await loadCountries().then(async (_countries: tCountry[]) => {
      countries = _countries;
      await loadPolicies()
        .then((_policies: tPolicy[]) => (policies = _policies))
        .then(async () => {
          await loadRoles()
            .then((_roles: tRole[]) => (roles = _roles))
            .then(async () => {
              await loadGroups().then(
                (_groups: tGroup[]) => (groups = _groups)
              );
            });
        });
    });
  };
  /**
   * retrieve the policyId, then load all services and all service statements.
   */
  await params.then(async (value: any) => {
    userId = value;

    if (userId) {
      await loadUserById(userId).then(async (_user: tUser | null) => {
        if (_user) {
          linkedPolicies = _user.policies.map((_policy: tPolicy) => _policy.id);
          linkedRoles = _user.roles.map((_role: tRole) => _role.id);
          linkedGroups = _user.groups.map((_group: Group) => _group.id);
        }
        users = _user ? [_user] : [];
        await loadAdditionalData();
      });
    } else {
      await loadUsers().then(async (_users: tUser[]) => {
        users = _users;
        await loadAdditionalData();
      });
    }
  });

  /**
   * call the role handler (which provides the UI for handling the roles)
   */
  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "IAM" },
        { name: "Users", url: absoluteUrl("/iam/users/id") },
      ]}
    >
      <UserHandler
        users={users}
        policies={policies}
        linkedpolicies={linkedPolicies}
        roles={roles}
        linkedroles={linkedRoles}
        groups={groups}
        linkedgroups={linkedGroups}
        countries={countries}
      />
    </PageContent>
  );
};

export default IamUsersPage;
