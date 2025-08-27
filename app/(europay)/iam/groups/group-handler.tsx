"use client";

import { useToastSettings } from "@/hooks/use-toast-settings";
import { tGroup, tPolicy, tRole, tUser } from "@/lib/prisma-types";
import { Data, ToastType } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GroupCarrousel, {
  defaultGroupEntity,
  GroupEntity,
} from "./group-carrousel";
import { mapGroups } from "@/app/client/mapping";
import { absoluteUrl, showToast } from "@/lib/util";
import TemplateAlert, { tAlert } from "@/ui/template-alert";
import { DATATABLE_ACTION_DELETE } from "@/lib/constants";
import { deleteGroup } from "@/app/server/groups";
import { TableMeta } from "@tanstack/react-table";
import PageItemContainer from "@/ui/page-item-container";
import Button from "@/ui/button";
import Dialog from "@/ui/dialog";
import { DataTable } from "@/ui/datatable/data-table";
import { columns, initialTableState } from "./table/page-colums";
import { DataTableToolbar } from "./table/page-data-table-toolbar";

/**
 * is called to providing the UI for handling the groups.
 *
 */
const GroupHandler = ({
  groups,
  policies,
  linkedpolicies,
  roles,
  linkedroles,
  users,
  linkedusers,
}: {
  groups: tGroup[];
  policies: tPolicy[];
  linkedpolicies: number[];
  roles: tRole[];
  linkedroles: number[];
  users: tUser[];
  linkedusers: number[];
}) => {
  const { push } = useRouter();
  const { getToastDuration } = useToastSettings();

  const [tableData, setTableData] = useState<Data[]>([]);
  const [entity, setEntity] = useState<GroupEntity>(defaultGroupEntity);

  const initialise = (): void => {
    setTableData(mapGroups(groups));
  };

  useEffect(() => {
    initialise();

    setLinkedPolicies(linkedpolicies);
    setLinkedRoles(linkedroles);
    setLinkedUsers(linkedusers);
  }, [users]);

  const processDeletedGroup = (_name: string): void => {
    showToast(ToastType.SUCCESS, `Deleted group ${_name}`, getToastDuration());

    push(absoluteUrl(`/iam/groups/id`));
  };

  const [alert, setAlert] = useState<tAlert | undefined>(undefined);

  // const [openDialog, setOpenDialog] = useState<number>(0);

  const [openDialog, setOpenDialog] = useState<number>(0);

  const handleOpenDialog = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "groupdialog"
    ) as HTMLDialogElement;

    dialog.showModal();
  };

  useEffect(() => {
    if (openDialog > 0) {
      handleOpenDialog();
    }
  }, [openDialog]);

  const openTheDialog = (): void => {
    setOpenDialog((x: number) => x + 1);
  };

  const [linkedPolicies, setLinkedPolicies] = useState<number[]>([]);
  const [linkedRoles, setLinkedRoles] = useState<number[]>([]);
  const [linkedUsers, setLinkedUsers] = useState<number[]>([]);

  const handleAction = async (action: string, group: Data) => {
    if (action === DATATABLE_ACTION_DELETE) {
      if (group.extra?.managed) {
        // replace this allowedToDeleteManaged by $iam function
        const allowedToDeleteManaged: boolean = false;

        if (allowedToDeleteManaged) {
          await deleteGroup(group.id).then(() =>
            processDeletedGroup(`${group.name}`)
          );
        } else {
          const alert: tAlert = {
            template: "UNABLE_TO_DELETE_MANAGED",
            params: { iamType: "Group" },
          };
          setAlert(alert);
        }
      } else {
        await deleteGroup(group.id).then(() =>
          processDeletedGroup(`${group.name}`)
        );
      }
    } else {
      const appgroup: tGroup | undefined = groups.find(
        (_group: tGroup) => _group.id === group.id
      );

      if (appgroup) {
        const entity: GroupEntity = {
          id: appgroup.id,
          name: appgroup.name ?? "",
          description: appgroup.description ?? "",
          managed: appgroup.managed ?? false,
        };

        let linked: number[] = appgroup.policies.map(
          (_policy: tPolicy) => _policy.id
        );
        setLinkedPolicies(linked);

        linked = appgroup.roles.map((_role: tRole) => _role.id);
        setLinkedRoles(linked);

        linked = appgroup.users.map((_user: tUser) => _user.id);
        setLinkedUsers(linked);

        setEntity(entity);
        openTheDialog();
      }
    }
  };

  const tableMeta: TableMeta<Data[]> = {
    handleAction: handleAction,
    // user: user,
  };

  // TODO => GROUPS
  const handleSetEntityAndOpenDialog = (): void => {
    let entity = { ...defaultGroupEntity };

    setLinkedPolicies([]);
    setLinkedRoles([]);
    setLinkedUsers([]);

    setEntity(entity);

    openTheDialog();
  };

  const renderComponent = () => {
    return (
      <div
        data-testid="groups"
        id="groups"
        className="w-[99vw] h-[83vh] rounded-sm grid items-start gap-2 grid-cols-1 grid-rows-10 overflow-y-scroll"
      >
        <PageItemContainer title="control" border={false}>
          <div className="flex items-center space-x-2 justify-between">
            <div></div>
            <Button
              name="create group"
              intent={"warning"}
              size={"small"}
              style={"soft"}
              onClick={handleSetEntityAndOpenDialog}
            />
          </div>
          <div>
            <Dialog
              title={"Handle group 👥"}
              id="groupdialog"
              form={
                <GroupCarrousel
                  entity={entity}
                  policies={policies}
                  linkedpolicies={linkedPolicies}
                  roles={roles}
                  linkedroles={linkedRoles}
                  users={users}
                  linkedusers={linkedUsers}
                />
              }
              className="w-11/12 max-w-6xl"
            />
          </div>
        </PageItemContainer>
        <PageItemContainer title="groups">
          <DataTable
            data={tableData}
            columns={columns}
            tablemeta={tableMeta}
            Toolbar={DataTableToolbar}
            initialState={initialTableState}
          />
        </PageItemContainer>
        <div className="flex justify-center">
          <TemplateAlert
            open={alert ? true : false}
            template={alert ? alert.template : ""}
            parameters={alert ? alert.params : {}}
          >
            <div className="flex space-x-1">
              <Button
                name="OK"
                intent="neutral"
                style="soft"
                size="small"
                className="bg-custom"
                onClick={() => setAlert(undefined)}
              />
            </div>
          </TemplateAlert>
        </div>
      </div>
    );
  };

  return <>{renderComponent()}</>;
};

export default GroupHandler;
