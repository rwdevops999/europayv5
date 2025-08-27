"use client";

import { mapPolicies } from "@/app/client/mapping";
import { ValidationConflict } from "@/app/server/data/validation-data";
import { createRole, updateRole } from "@/app/server/roles";
import { validateData } from "@/app/server/validate";
import { useToastSettings } from "@/hooks/use-toast-settings";
import { absoluteUrl, cn, showToast } from "@/lib/util";
import { displayPrismaErrorCode } from "@/lib/prisma-errors";
import {
  tPolicy,
  tRoleCreate,
  tRoleUpdate,
  tService,
} from "@/lib/prisma-types";
import { Data, ToastType } from "@/lib/types";
import Button from "@/ui/button";
import { DataTable } from "@/ui/datatable/data-table";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { JSX, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { columns } from "./table/dialog-columns";
import { DataTableToolbar } from "./table/dialog-data-table-toolbar";
import ValidationConflictsDialog from "@/ui/validation-conflicts-dialog";
import RoleDataRenderer from "./role-data-renderer";

export interface RoleEntity {
  id?: number; // role id
  rolename: string;
  description: string;
  managed: boolean;
}

export const defaultRoleEntity: RoleEntity = {
  rolename: "",
  description: "",
  managed: false,
};

export interface RoleFormProps {
  policies: tPolicy[];
  entity: RoleEntity;
  linkedpolicies: number[];
}

const RoleForm = (props: RoleFormProps) => {
  const { push } = useRouter();
  const { getToastDuration } = useToastSettings();

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

  const provisionRoleForCreate = (_entity: RoleEntity): tRoleCreate => {
    const result: tRoleCreate = {
      name: _entity.rolename,
      description: _entity.description,
      managed: _entity.managed,
      policies: {
        connect: selectedPolicies.current.map((_policy: Data) => {
          return {
            id: _policy.id,
          };
        }),
      },
    };

    return result;
  };

  const provisionRoleForUpdate = (_entity: RoleEntity): tRoleUpdate => {
    const result: tRoleUpdate = {
      id: _entity.id,
      name: _entity.rolename,
      description: _entity.description,
      managed: _entity.managed,
      policies: {
        set: selectedPolicies.current.map((policy: Data) => {
          return {
            id: policy.id,
          };
        }),
      },
    };

    return result;
  };

  const handleCreateRole = async (_entity: RoleEntity): Promise<void> => {
    const role: tRoleCreate = provisionRoleForCreate(_entity);
    await createRole(role).then((errorcode: string | undefined) => {
      if (errorcode) {
        showToast(
          ToastType.ERROR,
          `Role create error ${displayPrismaErrorCode(errorcode)}`,
          getToastDuration()
        );
        // show a toast here about error
        displayPrismaErrorCode(errorcode);
      } else {
        showToast(
          ToastType.SUCCESS,
          `Role ${role.name} created`,
          getToastDuration()
        );
        push(absoluteUrl(`/iam/roles/id`));
      }
      handleCancelClick();
    });
  };

  const handleUpdateRole = async (_entity: RoleEntity): Promise<void> => {
    const role: tRoleUpdate = provisionRoleForUpdate(_entity);

    await updateRole(role).then((errorcode: string | undefined) => {
      if (errorcode) {
        showToast(
          ToastType.ERROR,
          `Role update error ${displayPrismaErrorCode(errorcode)}`,
          getToastDuration()
        );
        // show a toast here about error
        displayPrismaErrorCode(errorcode);
      } else {
        showToast(
          ToastType.SUCCESS,
          `Role ${role.name} updated`,
          getToastDuration()
        );
        push(absoluteUrl(`/iam/roles/id`));
      }
      handleCancelClick();
    });
  };

  const onSubmit: SubmitHandler<RoleEntity> = async (formData: RoleEntity) => {
    const valid: boolean = await validateLinkedPolicies();

    if (valid) {
      if (formData.id) {
        handleUpdateRole(formData);
      } else {
        handleCreateRole(formData);
      }
    }
  };

  const handleCancelClick = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "roledialog"
    ) as HTMLDialogElement;

    dialog.close();
  };

  const processTableData = (): void => {
    let affectedPolicies: tPolicy[] = props.policies;

    // const service: tService | undefined = props.services.find(
    //   (_service: tService) => _service.id === _serviceId
    // );
    // if (service) {
    //   affectedPolicies = props.policies.filter(
    //     (_policy: tPolicy) =>
    //       _policy.servicestatements[0].serviceid === _serviceId
    //   );
    // }

    setTableData(mapPolicies(affectedPolicies));
  };

  const linkedPolicies = useRef<number[]>([]);

  const [resetPagination, setResetPagination] = useState<boolean>(false);

  useEffect(() => {
    processTableData();

    linkedPolicies.current = props.linkedpolicies;
    reset(props.entity);

    setResetPagination(true);
  }, [props]);

  const FormDetails = (): JSX.Element => {
    const focus = (_name: string) => {
      const element: HTMLElement | null = document.getElementById(_name);

      if (element) {
        window.setTimeout(() => {
          element.focus();
        }, 310);
      }
    };

    useEffect(() => {
      focus("rolename");
    }, []);

    return (
      <div className="ml-1 grid grid-rows-[25%_25%_25%_25%] gap-y-1 mt-0.75">
        <div className="grid grid-cols-[10%_40%_10%_40%] gap-y-1 mt-0.75 mb-15">
          <label className="mt-1">Name:</label>
          <input
            id="rolename"
            className={cn(
              "rounded-sm",
              "input validator input-sm w-[95%]",
              "border-1 border-base-content/30"
            )}
            type="text"
            required
            placeholder="name..."
            minLength={3}
            maxLength={50}
            {...register("rolename")}
          />
          <label className="mt-1">Description:</label>
          <input
            id="description"
            className={cn(
              "rounded-sm",
              "input validator input-sm w-[95%]",
              "border-1 border-base-content/30"
            )}
            type="text"
            required
            placeholder="description..."
            minLength={3}
            maxLength={50}
            {...register("description")}
          />
        </div>
        <div className="grid grid-cols-[10%_40%_10%_40%] gap-y-1">
          <label className="flex items-center">Managed:</label>
          <div className="flex items-center mt-1">
            <input
              type="checkbox"
              className="checkbox checkbox-md rounded-sm"
              {...register("managed")}
            />
          </div>
        </div>
      </div>
    );
  };

  const FormContent = (): JSX.Element => {
    return (
      <div className="relative w-[100%] h-[100%] grid grid-rows-[20%_80%]">
        <div></div>
        <div className="mt-2">
          <FormDetails />
        </div>
      </div>
    );
  };

  const [conflicts, setConflicts] = useState<ValidationConflict[]>([]);
  const [validationConflictDialogOpen, setValidationConflictDialogOpen] =
    useState<boolean>(false);

  const validateLinkedPolicies = async (): Promise<boolean> => {
    let valid: boolean = true;

    const _entity: RoleEntity = getValues();

    let data: Data = {
      id: -1,
      description: "",
      name: _entity.rolename,
      children: selectedPolicies.current,
      extra: {
        subject: "Policy",
      },
    };

    await validateData(data).then((conflicts: ValidationConflict[]) => {
      if (conflicts.length > 0) {
        setConflicts(conflicts);
        setValidationConflictDialogOpen(true);
      }

      valid = conflicts.length === 0;
    });

    return valid;
  };

  const FormButtons = (): JSX.Element => {
    return (
      <div className="flex flex-col">
        <Button
          name="Cancel"
          intent={"neutral"}
          style={"soft"}
          size={"small"}
          onClick={handleCancelClick}
          className="bg-cancel mb-1"
          type="button"
        />
        {!props.entity.id && (
          <Button
            name="Create"
            intent={"neutral"}
            style={"soft"}
            size={"small"}
            className="bg-custom mb-1"
            type="submit"
          />
        )}
        {props.entity.id && (
          <Button
            name="Update"
            intent={"neutral"}
            style={"soft"}
            size={"small"}
            className="bg-custom mb-1"
            type="submit"
          />
        )}
        {/* <Button
          name="Validate"
          intent={"neutral"}
          style={"soft"}
          size={"small"}
          className="bg-custom"
          type="button"
          onClick={validateLinkedPolicies}
        /> */}
      </div>
    );
  };

  const Form = (): JSX.Element => {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-[100%] h-[100%] grid grid-cols-[90%_10%]"
      >
        <div>
          <FormContent />
        </div>
        <div>
          <FormButtons />
        </div>
      </form>
    );
  };

  const [tableData, setTableData] = useState<Data[]>([]);

  const selectedPolicies = useRef<Data[]>([]);

  const handleChangePolicySelection = (_selection: Row<Data>[]) => {
    const selectionData: Data[] = _selection.map((row) => row.original);

    selectedPolicies.current = selectionData;

    const mappedPolicies = selectionData.map((data: Data) => data.id);
    const equal: boolean =
      mappedPolicies.length === linkedPolicies.current.length &&
      mappedPolicies.every(function (value, index) {
        return value === linkedPolicies.current[index];
      });
    if (!equal) {
      linkedPolicies.current = mappedPolicies;

      const valid: boolean = selectionData.length < 2;
    }
  };

  const handleSelectionChanged = (_selection: number[]): void => {
    const selectionData: Data[] = tableData.reduce<Data[]>(
      (acc: Data[], data: Data) => {
        if (
          _selection.includes(data.id) &&
          !acc.some((accvalue: Data) => accvalue.id === data.id)
        ) {
          acc.push(data);
        }

        return acc;
      },
      []
    );

    selectedPolicies.current = selectionData;
    linkedPolicies.current = _selection;
  };

  const renderComponent = () => {
    return (
      <div className="form relative w-[100%] h-[450px] grid grid-rows-[30%_70%]">
        <div>
          <Form />
          <RoleDataRenderer
            data={tableData}
            columns={columns}
            toolbar={DataTableToolbar}
            selectedIds={linkedPolicies.current}
            changeSelection={handleSelectionChanged}
          />
        </div>
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
      </div>
    );
  };

  return <>{renderComponent()}</>;
};

export default RoleForm;
