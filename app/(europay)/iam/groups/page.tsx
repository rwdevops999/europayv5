import { tGroup, tPolicy, tRole, tUser } from "@/app/lib/prisma-types";
import { loadAllPolicies } from "../../scripts/server/iam/policies";
import { loadAllRoles } from "../../scripts/server/iam/roles";
import { loadAllUsers } from "../../scripts/server/iam/users";
import { loadAllGroups, loadGroupById } from "../../scripts/server/iam/groups";
import PageContent from "@/app/ui/page-content";
import { absoluteUrl } from "@/app/lib/util";
import GroupHandler from "./group-handler";

const IamGroupsPage = async ({ params }: { params: Promise<any> }) => {
  let groupId: number | undefined;

  let groups: tGroup[] = [];
  let policies: tPolicy[] = [];
  let roles: tRole[] = [];
  let users: tUser[] = [];

  let linkedPolicies: number[] = [];
  let linkedRoles: number[] = [];
  let linkedUsers: number[] = [];

  const loadAdditionalData = async (): Promise<void> => {
    await loadAllPolicies()
      .then((_policies: tPolicy[]) => (policies = _policies))
      .then(async () => {
        await loadAllRoles()
          .then((_roles: tRole[]) => (roles = _roles))
          .then(async () => {
            await loadAllUsers().then((_users: tUser[]) => (users = _users));
          });
      });
  };
  /**
   * retrieve the policyId, then load all services and all service statements.
   */
  await params.then(async (value: any) => {
    groupId = value;

    if (groupId) {
      await loadGroupById(groupId).then(async (_group: tGroup | null) => {
        if (_group) {
          linkedPolicies = _group.policies.map(
            (_policy: tPolicy) => _policy.id
          );
          linkedRoles = _group.roles.map((_role: tRole) => _role.id);
          linkedUsers = _group.users.map((_user: tUser) => _user.id);
        }
        groups = _group ? [_group] : [];
        await loadAdditionalData();
      });
    } else {
      await loadAllGroups().then(async (_groups: tGroup[]) => {
        groups = _groups;
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
        { name: "Groups", url: absoluteUrl("/iam/groups/id") },
      ]}
    >
      <GroupHandler
        groups={groups}
        policies={policies}
        linkedpolicies={linkedPolicies}
        roles={roles}
        linkedroles={linkedRoles}
        users={users}
        linkedusers={linkedUsers}
      />
    </PageContent>
  );
};

export default IamGroupsPage;
