import { loadGroupById, loadGroups } from "@/app/server/groups";
import { loadPolicies } from "@/app/server/policies";
import { loadRoles } from "@/app/server/roles";
import { loadUsers } from "@/app/server/users";
import { absoluteUrl } from "@/lib/functions";
import { tGroup, tPolicy, tRole, tUser } from "@/lib/prisma-types";
import PageContent from "@/ui/page-content";
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
    await loadPolicies()
      .then((_policies: tPolicy[]) => (policies = _policies))
      .then(async () => {
        await loadRoles()
          .then((_roles: tRole[]) => (roles = _roles))
          .then(async () => {
            await loadUsers().then((_users: tUser[]) => (users = _users));
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
      await loadGroups().then(async (_groups: tGroup[]) => {
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
