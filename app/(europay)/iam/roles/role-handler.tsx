"use client";

import { useToastSettings } from "@/hooks/use-toast-settings";
import { tPolicy, tRole } from "@/lib/prisma-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RoleForm, { defaultRoleEntity, RoleEntity } from "./role-form";
import { Data, ToastType } from "@/lib/types";
import { mapRoles } from "@/app/client/mapping";
import TemplateAlert, { tAlert } from "@/ui/template-alert";
import { absoluteUrl, showToast } from "@/lib/functions";
import { DATATABLE_ACTION_DELETE } from "@/lib/constants";
import { deleteRole } from "@/app/server/roles";
import { TableMeta } from "@tanstack/react-table";
import PageItemContainer from "@/ui/page-item-container";
import Button from "@/ui/button";
import Dialog from "@/ui/dialog";
import { DataTable } from "@/ui/datatable/data-table";
import { columns } from "./table/page-colums";
import { DataTableToolbar } from "./table/page-data-table-toolbar";

/**
 * is called to providing the UI for handling the policies.
 *
 * @param roleid: the roleid or undefined
 * @param roles : all roles (with the policies)
 * @param policies : all policies
 * @returns
 */
const RoleHandler = ({
  roleid,
  roles,
  policies,
}: {
  roleid: number | undefined;
  roles: tRole[];
  policies: tPolicy[];
}) => {
  const { push } = useRouter();
  const { getToastDuration } = useToastSettings();

  const [entity, setEntity] = useState<RoleEntity>(defaultRoleEntity);
  const [linkedPolicies, setLinkedPolicies] = useState<number[]>([]);

  const [tableData, setTableData] = useState<Data[]>([]);

  const initialise = (): void => {
    let rolesToMap: tRole[] = roles;

    if (roleid) {
      // map policy whith that id
      const affectedRole: tRole | undefined = roles.find(
        (_role: tRole) => _role.id === roleid
      );
      if (affectedRole) {
        rolesToMap = [affectedRole];
      }
    }

    setTableData(mapRoles(rolesToMap));
  };

  useEffect(() => {
    initialise();
  }, [roles]);

  const [alert, setAlert] = useState<tAlert | undefined>(undefined);

  const processDeletedRole = (_name: string): void => {
    showToast(ToastType.SUCCESS, `Deleted role ${_name}`, getToastDuration());

    push(absoluteUrl(`/iam/roles/id`));
  };

  const roleInDependency = (
    _roleId: number,
    _template: string
  ): tAlert | undefined => {
    let alert: tAlert | undefined = undefined;

    const _role: tRole | undefined = roles.find(
      (role: tRole) => role.id === _roleId
    );

    // if (_role !== undefined) {
    //   if (_role.users && _role.users.length > 0) {
    //     alert = {
    //       template: _template,
    //       params: {
    //         iamType: "Role",
    //         linkedType: `User ${_role.users[0].firstname} ${_role.users[0].lastname}`,
    //       },
    //     };
    //   } else if (_role.groups && _role.groups.length > 0) {
    //     alert = {
    //       template: _template,
    //       params: {
    //         iamType: "Role",
    //         linkedType: `Group ${_role.groups[0].name}`,
    //       },
    //     };
    //   }
    // }

    return alert;
  };

  const handleAction = async (action: string, role: Data) => {
    if (action === DATATABLE_ACTION_DELETE) {
      if (role.extra?.managed) {
        // replace this allowedToDeleteManaged by $iam function
        const allowedToDeleteManaged: boolean = false;

        if (allowedToDeleteManaged) {
          const alert: tAlert | undefined = roleInDependency(
            role.id,
            "UNABLE_TO_DELETE_LINKED"
          );

          if (alert) {
            setAlert(alert);
          } else {
            await deleteRole(role.id).then(() => processDeletedRole(role.name));
          }
        } else {
          const alert: tAlert = {
            template: "UNABLE_TO_DELETE_MANAGED",
            params: { iamType: "Role" },
          };
          setAlert(alert);
        }
      } else {
        const alert: tAlert | undefined = roleInDependency(
          role.id,
          "UNABLE_TO_DELETE_LINKED"
        );

        if (alert) {
          setAlert(alert);
        } else {
          await deleteRole(role.id).then(() => processDeletedRole(role.name));
        }
      }
    } else {
      const alert: tAlert | undefined = roleInDependency(
        role.id,
        "UNABLE_TO_UPDATE_LINKED"
      );

      if (alert) {
        setAlert(alert);
      } else {
        const rol: tRole | undefined = roles.find(
          (_role: tRole) => _role.id === role.id
        );
        if (rol) {
          const entity: RoleEntity = {
            id: rol.id,
            rolename: rol.name,
            description: rol.description ?? "",
            managed: rol.managed ?? false,
          };

          const linked: number[] = rol.policies.map(
            (policy: tPolicy) => policy.id
          );
          setEntity(entity);
          setLinkedPolicies(linked);
          openTheDialog();
        }
      }
    }
  };

  const tableMeta: TableMeta<Data[]> = {
    handleAction: handleAction,
    // user: user,
  };

  const [openDialog, setOpenDialog] = useState<number>(0);

  const handleOpenDialog = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "roledialog"
    ) as HTMLDialogElement;

    dialog.showModal();
  };

  useEffect(() => {
    if (openDialog > 0) {
      handleOpenDialog();
    }
  }, [openDialog]);

  const handleSetEntityAndOpenDialog = (): void => {
    let entity = { ...defaultRoleEntity };

    setEntity(entity);
    setLinkedPolicies([]);

    openTheDialog();
  };

  const openTheDialog = (): void => {
    setOpenDialog((x: number) => x + 1);
  };

  const renderComponent = () => {
    return (
      <div
        data-testid="policies"
        id="policies"
        className="w-[99vw] h-[83vh] rounded-sm grid items-start gap-2 grid-cols-1 grid-rows-10 overflow-y-scroll"
      >
        <PageItemContainer title="control" border={false}>
          <div className="flex items-center space-x-2 justify-between">
            <div></div>
            <Button
              name="create role"
              intent={"warning"}
              size={"small"}
              style={"soft"}
              onClick={handleSetEntityAndOpenDialog}
            />
          </div>
          <div>
            <Dialog
              title={"Create role"}
              id="roledialog"
              form={
                <RoleForm
                  policies={policies}
                  entity={entity}
                  linkedpolicies={linkedPolicies}
                />
              }
              className="w-11/12 max-w-6xl"
            />
          </div>
        </PageItemContainer>
        <PageItemContainer title="roles">
          <DataTable
            data={tableData}
            columns={columns}
            tablemeta={tableMeta}
            Toolbar={DataTableToolbar}
            expandAll={roleid === undefined ? false : true}
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

export default RoleHandler;
