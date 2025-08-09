import { loadAllUsers, loadUserById } from "../../scripts/server/iam/users";
import { loadAllPolicies } from "../../scripts/server/iam/policies";
import { loadAllRoles } from "../../scripts/server/iam/roles";
import { loadAllGroups } from "../../scripts/server/iam/groups";
import PageContent from "@/app/ui/page-content";
import { absoluteUrl, json } from "@/app/lib/util";
import UserHandler from "./user-handler";
import { loadAllCountries } from "../../scripts/server/country";
import {
  tCountry,
  tGroup,
  tPolicy,
  tRole,
  tUser,
} from "@/app/lib/prisma-types";
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
    await loadAllCountries().then(async (_countries: tCountry[]) => {
      countries = _countries;
      await loadAllPolicies()
        .then((_policies: tPolicy[]) => (policies = _policies))
        .then(async () => {
          await loadAllRoles()
            .then((_roles: tRole[]) => (roles = _roles))
            .then(async () => {
              await loadAllGroups().then(
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
      await loadAllUsers().then(async (_users: tUser[]) => {
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
