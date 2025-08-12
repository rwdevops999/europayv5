"use client";

import { useToastSettings } from "@/hooks/use-toast-settings";
import { tCountry, tGroup, tPolicy, tRole, tUser } from "@/lib/prisma-types";
import { Data, ToastType } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserCarrousel, { defaultUserEntity, UserEntity } from "./user-carrousel";
import { mapUsers } from "@/app/client/mapping";
import { absoluteUrl, showToast } from "@/lib/util";
import TemplateAlert, { tAlert } from "@/ui/template-alert";
import { DATATABLE_ACTION_DELETE } from "@/lib/constants";
import { deleteUser } from "@/app/server/users";
import { TableMeta } from "@tanstack/react-table";
import PageItemContainer from "@/ui/page-item-container";
import Button from "@/ui/button";
import Dialog from "@/ui/dialog";
import { DataTable } from "@/ui/datatable/data-table";
import { columns } from "./table/page-colums";
import { DataTableToolbar } from "./table/page-data-table-toolbar";
import { Group } from "@/generated/prisma";

/**
 * is called to providing the UI for handling the users.
 *
 */
const UserHandler = ({
  users,
  policies,
  linkedpolicies,
  roles,
  linkedroles,
  groups,
  linkedgroups,
  countries,
}: {
  users: tUser[];
  policies: tPolicy[];
  linkedpolicies: number[];
  roles: tRole[];
  linkedroles: number[];
  groups: tGroup[];
  linkedgroups: number[];
  countries: tCountry[];
}) => {
  const { push } = useRouter();
  const { getToastDuration } = useToastSettings();

  const [tableData, setTableData] = useState<Data[]>([]);
  const [entity, setEntity] = useState<UserEntity>(defaultUserEntity);

  const initialise = (): void => {
    setTableData(mapUsers(users));
  };

  useEffect(() => {
    initialise();
    setLinkedPolicies(linkedpolicies);
    setLinkedRoles(linkedroles);
    setLinkedGroups(linkedgroups);
  }, [users]);

  const processDeletedUser = (_name: string): void => {
    showToast(ToastType.SUCCESS, `Deleted user ${_name}`, getToastDuration());

    push(absoluteUrl(`/iam/users/id`));
  };

  const [alert, setAlert] = useState<tAlert | undefined>(undefined);

  const [openDialog, setOpenDialog] = useState<number>(0);

  const handleOpenDialog = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "userdialog"
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

  const userInGroup = (
    _userId: number,
    _template: string
  ): tAlert | undefined => {
    let alert: tAlert | undefined = undefined;

    const user: tUser | undefined = users.find(
      (_user: tUser) => _user.id === _userId
    );

    if (user !== undefined && user.groups && user.groups.length > 0) {
      alert = {
        template: _template,
        params: {
          iamType: "User",
          linkedType: `Group ${user.groups[0].name}`,
        },
      };
    }

    return alert;
  };

  const [linkedPolicies, setLinkedPolicies] = useState<number[]>([]);
  const [linkedRoles, setLinkedRoles] = useState<number[]>([]);
  const [linkedGroups, setLinkedGroups] = useState<number[]>([]);

  const handleAction = async (action: string, user: Data) => {
    if (action === DATATABLE_ACTION_DELETE) {
      if (user.extra?.managed) {
        // replace this allowedToDeleteManaged by $iam function
        const allowedToDeleteManaged: boolean = false;

        if (allowedToDeleteManaged) {
          const alert: tAlert | undefined = userInGroup(
            user.id,
            "UNABLE_TO_DELETE_LINKED"
          );

          if (alert) {
            setAlert(alert);
          } else {
            await deleteUser(user.id).then(() =>
              processDeletedUser(`${user.name} ${user.description}`)
            );
          }
        } else {
          const alert: tAlert = {
            template: "UNABLE_TO_DELETE_MANAGED",
            params: { iamType: "User" },
          };
          setAlert(alert);
        }
      } else {
        const alert: tAlert | undefined = userInGroup(
          user.id,
          "UNABLE_TO_DELETE_LINKED"
        );

        if (alert) {
          setAlert(alert);
        } else {
          await deleteUser(user.id).then(() =>
            processDeletedUser(`${user.name} ${user.description}`)
          );
        }
      }
    } else {
      const alert: tAlert | undefined = userInGroup(
        user.id,
        "UNABLE_TO_UPDATE_LINKED"
      );

      if (alert) {
        setAlert(alert);
      } else {
        const appuser: tUser | undefined = users.find(
          (_user: tUser) => _user.id === user.id
        );

        if (appuser) {
          const entity: UserEntity = {
            id: appuser.id,
            username: appuser.username ?? "",
            lastname: appuser.lastname,
            firstname: appuser.firstname,
            avatar: appuser.avatar ?? "john.doe.png",
            phone: appuser.phone ?? "",
            email: appuser.email,
            password: appuser.password,
            passwordless: appuser.passwordless ?? false,
            blocked: appuser.blocked ?? false,
            managed: appuser.managed ?? false,
            address: {
              id: appuser.address?.id,
              street: appuser.address?.street ?? "",
              number: appuser.address?.number ?? "",
              box: appuser.address?.box ?? "",
              city: appuser.address?.city ?? "",
              postalcode: appuser.address?.postalcode ?? "",
              county: appuser.address?.county ?? "",
              country: {
                id: appuser.address?.country?.id,
                name: appuser.address?.country?.name,
                dialCode: appuser.address?.country?.dialCode ?? "",
              },
            },
          };

          let linked: number[] = appuser.policies.map(
            (_policy: tPolicy) => _policy.id
          );
          setLinkedPolicies(linked);

          linked = appuser.roles.map((_role: tRole) => _role.id);
          setLinkedRoles(linked);

          linked = appuser.groups.map((_group: Group) => _group.id);
          setLinkedGroups(linked);

          setEntity(entity);
          openTheDialog();
        }
      }
    }
  };

  const tableMeta: TableMeta<Data[]> = {
    handleAction: handleAction,
    // user: user,
  };

  // TODO => GROUPS
  const handleSetEntityAndOpenDialog = (): void => {
    let entity = { ...defaultUserEntity };

    setLinkedPolicies([]);
    setLinkedRoles([]);
    setLinkedGroups([]);

    setEntity(entity);

    openTheDialog();
  };

  const renderComponent = () => {
    return (
      <div
        data-testid="users"
        id="users"
        className="w-[99vw] h-[83vh] rounded-sm grid items-start gap-2 grid-cols-1 grid-rows-10 overflow-y-scroll"
      >
        <PageItemContainer title="control" border={false}>
          <div className="flex items-center space-x-2 justify-between">
            <div></div>
            <Button
              name="create user"
              intent={"warning"}
              size={"small"}
              style={"soft"}
              onClick={handleSetEntityAndOpenDialog}
            />
          </div>
          <div>
            <Dialog
              title={"Handle user 👤"}
              id="userdialog"
              form={
                <UserCarrousel
                  entity={entity}
                  policies={policies}
                  linkedpolicies={linkedPolicies}
                  roles={roles}
                  linkedroles={linkedRoles}
                  groups={groups}
                  linkedgroups={linkedGroups}
                  countries={countries}
                />
              }
              className="w-11/12 max-w-6xl"
            />
          </div>
        </PageItemContainer>
        <PageItemContainer title="users">
          <DataTable
            data={tableData}
            columns={columns}
            tablemeta={tableMeta}
            Toolbar={DataTableToolbar}
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

export default UserHandler;
