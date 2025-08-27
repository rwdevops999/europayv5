"use client";

import { mapPolicies, mapRoles, mapUsers } from "@/app/client/mapping";
import { useToastSettings } from "@/hooks/use-toast-settings";
import {
  tGroupCreate,
  tGroupUpdate,
  tPolicy,
  tRole,
  tUser,
} from "@/lib/prisma-types";
import { Data, ToastType } from "@/lib/types";
import { DataTable } from "@/ui/datatable/data-table";
import { useRouter } from "next/navigation";
import { JSX, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { columnsRoles } from "./table/colums-roles";
import { DataTableToolbar } from "./table/page-data-table-toolbar";
import { columnsPolicies } from "./table/colums-policies";
import { columnsUsers } from "./table/colums-users";
import { HiUserGroup } from "react-icons/hi";
import { MdPolicy } from "react-icons/md";
import { GiScrollUnfurled } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { createGroup, updateGroup } from "@/app/server/groups";
import { absoluteUrl, showToast } from "@/lib/util";
import { displayPrismaErrorCode } from "@/lib/prisma-errors";
import { ValidationConflict } from "@/app/server/data/validation-data";
import { validateData } from "@/app/server/validate";
import Button from "@/ui/button";
import ValidationConflictsDialog from "@/ui/validation-conflicts-dialog";
import { PaginationState } from "@tanstack/react-table";
import DataRenderer from "./data-renderer";

export interface GroupEntity {
  id?: number;
  name: string;
  description: string;
  managed?: boolean;
}

export const defaultGroupEntity: GroupEntity = {
  name: "",
  description: "",
  managed: false,
};

export interface GroupCarrouselProps {
  entity: GroupEntity;
  policies: tPolicy[];
  linkedpolicies: number[];
  roles: tRole[];
  linkedroles: number[];
  users: tUser[];
  linkedusers: number[];
}

enum Pages {
  DETAILS = "details",
  POLICIES = "policies",
  ROLES = "roles",
  USERS = "users",
}

const GroupCarrousel = (props: GroupCarrouselProps) => {
  const { push } = useRouter();
  const { getToastDuration } = useToastSettings();

  const currentPage = useRef<string>(Pages.DETAILS);
  const showCurrentPage = (_page: string): void => {
    const element: HTMLElement | null = document.getElementById(_page);
    if (element) {
      element.scrollIntoView({ behavior: "instant" });
    }
  };

  const formMethods = useForm({
    defaultValues: props.entity,
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
  } = formMethods;

  const [tableDataPolicies, setTableDataPolicies] = useState<Data[]>([]);
  const [tableDataRoles, setTableDataRoles] = useState<Data[]>([]);
  const [tableDataUsers, setTableDataUsers] = useState<Data[]>([]);

  const processTableData = (
    _policies: tPolicy[],
    _roles: tRole[],
    _users: tUser[]
  ): void => {
    setTableDataPolicies(mapPolicies(_policies));
    setTableDataRoles(mapRoles(_roles));
    setTableDataUsers(mapUsers(_users));
  };

  const linkedPolicies = useRef<number[]>([]);
  const linkedRoles = useRef<number[]>([]);
  const linkedUsers = useRef<number[]>([]);

  const [reload, setReload] = useState<number>(0);

  const ignoreEscape = (): void => {
    addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  };

  const [resetPagination, setResetPagination] = useState<boolean>(false);

  useEffect(() => {
    ignoreEscape();

    linkedPolicies.current = props.linkedpolicies;
    linkedRoles.current = props.linkedroles;
    linkedUsers.current = props.linkedusers;

    setReload((x: number) => x + 1);

    processTableData(props.policies, props.roles, props.users);

    reset(props.entity);

    currentPage.current = Pages.DETAILS;
    showCurrentPage(Pages.DETAILS);

    setResetPagination(true);
  }, [props]);

  const GroupFormControl = (): JSX.Element => {
    return (
      <div className="grid grid-cols-[1%_7%_2%] py-1.5">
        <div className="col-start-2">
          <label className="text-sm">Managed:</label>
        </div>
        <div className="col-start-3 -mt-0.5">
          <input
            type="checkbox"
            className="checkbox checkbox-xs rounded-sm"
            {...register("managed")}
          />
        </div>
      </div>
    );
  };

  const FormNameDescription = (): JSX.Element => {
    const focus = (_name: string) => {
      const element: HTMLElement | null = document.getElementById(_name);

      if (element) {
        window.setTimeout(() => {
          element.focus();
        }, 310);
      }
    };

    useEffect(() => {
      focus("groupname");
    }, []);

    return (
      <div className="grid grid-cols-[1%_48%_2%_48%_2%]">
        <div className="col-start-2">
          <input
            id="groupname"
            type="text"
            placeholder="name..."
            className="input input-sm w-11/12 validator"
            required
            minLength={1}
            maxLength={50}
            {...register("name")}
          />
        </div>
        <div className="col-start-4">
          <input
            type="text"
            placeholder="description..."
            className="input input-sm w-11/12 validator"
            required
            minLength={1}
            maxLength={50}
            {...register("description")}
          />
        </div>
      </div>
    );
  };

  const GroupFormIdentification = (): JSX.Element => {
    return (
      <div>
        <div className="mt-1">
          <FormNameDescription />
        </div>
      </div>
    );
  };

  const GroupForm = (): JSX.Element => {
    return (
      <div className="grid w-[100%] grid-rows-[10%_55%_35%] space-y-1">
        <GroupFormControl />
        <GroupFormIdentification />
      </div>
    );
  };

  const handleRoleSelectionChanged = (_selection: number[]): void => {
    linkedRoles.current = _selection;

    showCurrentPage(currentPage.current);
  };

  const Roles = (): JSX.Element => {
    return (
      <DataRenderer
        data={tableDataRoles}
        columns={columnsRoles}
        toolbar={DataTableToolbar}
        selectedIds={linkedRoles.current}
        changeSelection={handleRoleSelectionChanged}
      />
    );
  };

  const handlePolicySelectionChanged = (_selection: number[]): void => {
    linkedPolicies.current = _selection;

    showCurrentPage(currentPage.current);
  };

  const Policies = (): JSX.Element => {
    return (
      <DataRenderer
        data={tableDataPolicies}
        columns={columnsPolicies}
        toolbar={DataTableToolbar}
        selectedIds={linkedPolicies.current}
        changeSelection={handlePolicySelectionChanged}
      />
    );
  };

  const handleUserSelectionChanged = (_selection: number[]): void => {
    linkedUsers.current = _selection;

    showCurrentPage(currentPage.current);
  };

  const Users = (): JSX.Element => {
    return (
      <DataRenderer
        data={tableDataUsers}
        columns={columnsUsers}
        toolbar={DataTableToolbar}
        selectedIds={linkedUsers.current}
        changeSelection={handleUserSelectionChanged}
      />
    );
  };

  const handleDetailsPage = (): void => {
    currentPage.current = Pages.DETAILS;
    location.href = "#details";
  };

  const handlePoliciesPage = (): void => {
    currentPage.current = Pages.POLICIES;
    location.href = "#policies";
  };

  const handleRolesPage = (): void => {
    currentPage.current = Pages.ROLES;
    location.href = "#roles";
  };

  const handleUsersPage = (): void => {
    currentPage.current = Pages.USERS;
    location.href = "#users";
  };

  const Carrousel = (): JSX.Element => {
    return (
      <>
        <div id="carrousel" className="relative h-[95%] carousel w-full">
          <div id="details" className="carousel-item w-full">
            <GroupForm />
          </div>
          <div id="policies" className="carousel-item w-full">
            <Policies />
          </div>
          <div id="roles" className="carousel-item w-full">
            <Roles />
          </div>
          <div id="users" className="carousel-item w-full">
            <Users />
          </div>
        </div>
        <div className="flex w-full justify-center gap-2 py-2">
          <button
            type="button"
            onClick={handleDetailsPage}
            className="flex items-center space-x-2"
          >
            <HiUserGroup size={16} />
            <label className="cursor-pointer text-xs">Details</label>
          </button>

          <button
            type="button"
            onClick={handlePoliciesPage}
            className="flex items-center space-x-2"
          >
            <MdPolicy size={16} />
            <label className="cursor-pointer text-xs">Policies</label>
          </button>

          <button
            type="button"
            onClick={handleRolesPage}
            className="flex items-center space-x-2"
          >
            <GiScrollUnfurled size={16} />
            <label className="cursor-pointer text-xs">Roles</label>
          </button>

          <button
            type="button"
            onClick={handleUsersPage}
            className="flex items-center space-x-2"
          >
            <FaUser size={16} />
            <label className="cursor-pointer text-xs">Users</label>
          </button>
        </div>
      </>
    );
  };

  const provisionGroupForCreate = (_entity: GroupEntity): tGroupCreate => {
    const result: tGroupCreate = {
      name: _entity.name,
      description: _entity.description,
      managed: _entity.managed,

      policies: {
        connect: linkedPolicies.current.map((_id: number) => {
          return { id: _id };
        }),
      },
      roles: {
        connect: linkedRoles.current.map((_id: number) => {
          return { id: _id };
        }),
      },
      users: {
        connect: linkedUsers.current.map((_id: number) => {
          return { id: _id };
        }),
      },
    };

    return result;
  };

  const handleCreateGroup = async (_entity: GroupEntity): Promise<void> => {
    const group: tGroupCreate = provisionGroupForCreate(_entity);

    await createGroup(group).then((errorcode: string | undefined) => {
      if (errorcode) {
        showToast(
          ToastType.ERROR,
          `Group create error ${displayPrismaErrorCode(errorcode)}`,
          getToastDuration()
        );
        // show a toast here about error
        displayPrismaErrorCode(errorcode);
      } else {
        showToast(
          ToastType.SUCCESS,
          `Group '${group.name}' created`,
          getToastDuration()
        );
        push(absoluteUrl(`/iam/groups/id`));
      }
      handleCancelClick();
    });
  };

  const provisionGroupForUpdate = (_entity: GroupEntity): tGroupUpdate => {
    const result: tGroupUpdate = {
      id: _entity.id,
      name: _entity.name,
      description: _entity.description,
      managed: _entity.managed,
      policies: {
        set: linkedPolicies.current.map((_id: number) => {
          return { id: _id };
        }),
      },
      roles: {
        set: linkedRoles.current.map((_id: number) => {
          return { id: _id };
        }),
      },
      users: {
        set: linkedUsers.current.map((_id: number) => {
          return { id: _id };
        }),
      },
    };

    return result;
  };

  const handleUpdateGroup = async (_entity: GroupEntity): Promise<void> => {
    const group: tGroupUpdate = provisionGroupForUpdate(_entity);

    await updateGroup(group).then((errorcode: string | undefined) => {
      if (errorcode) {
        showToast(
          ToastType.ERROR,
          `Group update error ${displayPrismaErrorCode(errorcode)}`,
          getToastDuration()
        );
        // show a toast here about error
        displayPrismaErrorCode(errorcode);
      } else {
        showToast(
          ToastType.SUCCESS,
          `Group '${group.name}' updated`,
          getToastDuration()
        );
        push(absoluteUrl(`/iam/groups/id`));
      }
      handleCancelClick();
    });
  };

  const onSubmit: SubmitHandler<GroupEntity> = async (
    formData: GroupEntity
  ) => {
    const valid: boolean = await validateDependencies();

    if (valid) {
      if (formData.id) {
        handleUpdateGroup(formData);
      } else {
        handleCreateGroup(formData);
      }
    }
  };

  const handleCancelClick = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "groupdialog"
    ) as HTMLDialogElement;

    dialog.close();
  };

  const [conflicts, setConflicts] = useState<ValidationConflict[]>([]);
  const [validationConflictDialogOpen, setValidationConflictDialogOpen] =
    useState<boolean>(false);

  const validateDependencies = async (): Promise<boolean> => {
    let valid: boolean = true;

    const _entity: GroupEntity = getValues();

    const _selectedPolicies: tPolicy[] = props.policies.filter(
      (_policy: tPolicy) => linkedPolicies.current.includes(_policy.id)
    );
    const _mappedPolicies: Data[] = mapPolicies(_selectedPolicies);

    const _selectedRoles: tRole[] = props.roles.filter((_role: tRole) =>
      linkedRoles.current.includes(_role.id)
    );
    const _mappedRoles: Data[] = mapRoles(_selectedRoles);

    let data: Data = {
      id: -1,
      description: "",
      name: _entity.name,
      children: [..._mappedPolicies, ..._mappedRoles],
      extra: {
        subject: "Group",
      },
    };

    await validateData(data).then((conflicts: ValidationConflict[]) => {
      if (conflicts.length > 0) {
        setConflicts(conflicts);
        setValidationConflictDialogOpen(true);
      }

      valid = !(conflicts.length > 0);
    });

    return valid;
  };

  const Buttons = (): JSX.Element => {
    return (
      <div className="flex flex-col">
        <Button
          id="cancelbutton"
          name="Cancel"
          intent={"neutral"}
          style={"soft"}
          size={"small"}
          onClick={handleCancelClick}
          className="bg-cancel"
          type="button"
        />
        {!props.entity.id && (
          <Button
            id="createbutton"
            name="Create"
            intent={"neutral"}
            style={"soft"}
            size={"small"}
            className="bg-custom"
            type="submit"
          />
        )}
        {props.entity.id && (
          <Button
            id="updatebutton"
            name="Update"
            intent={"neutral"}
            style={"soft"}
            size={"small"}
            className="bg-custom"
            type="submit"
          />
        )}
      </div>
    );
  };

  const renderComponent = () => {
    return (
      <>
        <div className="hidden">{reload}</div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative w-[100%] h-[450px] grid grid-cols-[90%_10%]"
        >
          <div>
            <Carrousel />
          </div>
          <div className="flex justify-end">
            <Buttons />
          </div>
        </form>
        <ValidationConflictsDialog
          open={validationConflictDialogOpen}
          conflicts={conflicts}
        >
          <Button
            name="Close"
            onClick={() => setValidationConflictDialogOpen(false)}
            className="bg-custom"
            size="small"
          />
        </ValidationConflictsDialog>
      </>
    );
  };

  return <>{renderComponent()}</>;
};

export default GroupCarrousel;
