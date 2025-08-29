"use client";

import { mapServiceStatements } from "@/app/client/mapping";
import { ValidationConflict } from "@/app/server/data/validation-data";
import { createPolicy, updatePolicy } from "@/app/server/policies";
import { validateData } from "@/app/server/validate";
import { absoluteUrl, cn, showToast } from "@/lib/util";
import { displayPrismaErrorCode } from "@/lib/prisma-errors";
import {
  tPolicyCreate,
  tPolicyUpdate,
  tService,
  tServiceStatement,
} from "@/lib/prisma-types";
import { Data, ToastType } from "@/lib/types";
import Button from "@/ui/button";
import { DataTable } from "@/ui/datatable/data-table";
import ServiceSelect from "@/ui/service-select";
import { PaginationState, Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { JSX, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { columns } from "./table/dialog-columns";
import { DataTableToolbar } from "./table/dialog-data-table-toolbar";
import ValidationConflictsDialog from "@/ui/validation-conflicts-dialog";
import { useToastSettings } from "@/hooks/use-toast-settings";
import PolicyDataRenderer from "./policy-data-renderer";

export interface PolicyEntity {
  id?: number; // statement id
  policyname: string;
  description: string;
  managed: boolean;
  serviceid: number | undefined;
}

export const defaultPolicyEntity: PolicyEntity = {
  policyname: "",
  description: "",
  managed: false,
  serviceid: undefined,
};

export interface PolicyFormProps {
  services: tService[];
  servicestatements: tServiceStatement[];
  entity: PolicyEntity;
  linkedstatements: number[];
}

const PolicyForm = (props: PolicyFormProps) => {
  const { push } = useRouter();
  const { getToastDuration } = useToastSettings();

  const [disabled, setDisabled] = useState(false);

  const formMethods = useForm({
    disabled,
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

  const provisionPolicyForCreate = (_entity: PolicyEntity): tPolicyCreate => {
    const result: tPolicyCreate = {
      name: _entity.policyname,
      description: _entity.description,
      managed: _entity.managed,
      servicestatements: {
        connect: selectedStatements.current.map((_statement: Data) => {
          return {
            id: _statement.id,
          };
        }),
      },
    };

    return result;
  };

  const provisionPolicyForUpdate = (_entity: PolicyEntity): tPolicyUpdate => {
    const result: tPolicyUpdate = {
      id: _entity.id,
      name: _entity.policyname,
      description: _entity.description,
      managed: _entity.managed,
      servicestatements: {
        set: selectedStatements.current.map((statement: Data) => {
          return {
            id: statement.id,
          };
        }),
      },
    };

    return result;
  };

  const handleCreatePolicy = async (_entity: PolicyEntity): Promise<void> => {
    const policy: tPolicyCreate = provisionPolicyForCreate(_entity);
    await createPolicy(policy).then((errorcode: string | undefined) => {
      if (errorcode) {
        showToast(
          ToastType.ERROR,
          `Policy create error ${displayPrismaErrorCode(errorcode)}`,
          getToastDuration()
        );
        // show a toast here about error
        displayPrismaErrorCode(errorcode);
      } else {
        showToast(
          ToastType.SUCCESS,
          `Policy ${policy.name} created`,
          getToastDuration()
        );
        push(absoluteUrl(`/iam/policies/serviceid=${props.entity.serviceid}`));
      }
      handleCancelClick();
    });
  };

  const handleUpdatePolicy = async (_entity: PolicyEntity): Promise<void> => {
    const policy: tPolicyUpdate = provisionPolicyForUpdate(_entity);

    await updatePolicy(policy).then((errorcode: string | undefined) => {
      if (errorcode) {
        showToast(
          ToastType.ERROR,
          `Policy update error ${displayPrismaErrorCode(errorcode)}`,
          getToastDuration()
        );
        // show a toast here about error
        displayPrismaErrorCode(errorcode);
      } else {
        showToast(
          ToastType.SUCCESS,
          `Policy ${policy.name} updated`,
          getToastDuration()
        );
        push(absoluteUrl(`/iam/policies/serviceid=${props.entity.serviceid}`));
      }
      handleCancelClick();
    });
  };

  const onSubmit: SubmitHandler<PolicyEntity> = async (
    formData: PolicyEntity
  ) => {
    setDisabled(true);
    const valid: boolean = await validateLinkedStatements();

    if (valid) {
      formData = { ...formData, serviceid: selectedServiceId.current! };

      if (formData.id) {
        handleUpdatePolicy(formData);
      } else {
        handleCreatePolicy(formData);
      }
    }
    setDisabled(false);
  };

  const handleCancelClick = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "policydialog"
    ) as HTMLDialogElement;

    dialog.close();
  };

  const processTableData = (_serviceId: number | undefined): Data[] => {
    let tableData: Data[] = [];

    let affectedStatements: tServiceStatement[] = props.servicestatements;

    if (_serviceId) {
      const service: tService | undefined = props.services.find(
        (_service: tService) => _service.id === _serviceId
      );
      if (service) {
        affectedStatements = props.servicestatements.filter(
          (_statement: tServiceStatement) => _statement.serviceid === _serviceId
        );
      }
    }

    tableData = mapServiceStatements(affectedStatements);
    setTableData(tableData);

    return tableData;
  };

  const linkedStatements = useRef<number[]>([]);

  const setSelectedStatements = (
    _selection: number[],
    _tableData: Data[]
  ): void => {
    const selectionData: Data[] = _tableData.reduce<Data[]>(
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

    selectedStatements.current = selectionData;
  };

  useEffect(() => {
    let tableData: Data[] = [];
    if (props.entity.serviceid) {
      selectedServiceId.current = props.entity.serviceid;
      tableData = processTableData(props.entity.serviceid);
    } else {
      if (props.services && props.services.length > 0) {
        selectedServiceId.current = props.services[0].id;
        tableData = processTableData(props.services[0].id);
      }
    }

    linkedStatements.current = props.linkedstatements;
    setSelectedStatements(props.linkedstatements, tableData);

    reset(props.entity);
  }, [props]);

  const selectedServiceId = useRef<number | undefined>(undefined);

  const handleChangeService = (_serviceId: number | undefined): void => {
    selectedServiceId.current = _serviceId;
    const tableData: Data[] = processTableData(_serviceId);
    setSelectedStatements(props.linkedstatements, tableData);
  };

  // const [managed, setManaged] = useState<boolean>(false);

  const Select = (): JSX.Element => {
    return (
      <div>
        <ServiceSelect
          label="Service:"
          services={props.services}
          defaultService={selectedServiceId.current}
          changeServiceHandler={handleChangeService}
          className="w-[20%] ml-8"
        />
      </div>
    );
  };

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
      focus("policyname");
    }, []);

    return (
      <div className="ml-1 grid grid-rows-[25%_25%_25%_25%] gap-y-1 mt-0.75">
        <div className="grid grid-cols-[10%_40%_10%_40%] gap-y-1 mt-0.75">
          <label className="mt-1">Name:</label>
          <input
            id="policyname"
            type="text"
            placeholder="name..."
            className={cn(
              "rounded-sm",
              "input input-sm validator w-[95%]",
              "border-1 border-base-content/30"
            )}
            required
            minLength={3}
            maxLength={50}
            {...register("policyname")}
          />
          <label className="mt-1">Description:</label>
          <input
            type="text"
            placeholder="description..."
            className={cn(
              "rounded-sm",
              "input input-sm validator w-[95%]",
              "border-1 border-base-content/30"
            )}
            required
            minLength={3}
            maxLength={50}
            {...register("description")}
          />
        </div>
        <div className="grid grid-cols-[10%_40%_10%_40%] mt-5">
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
        <div>
          <Select />
        </div>
        <div className="mt-2">
          <FormDetails />
        </div>
      </div>
    );
  };

  const [conflicts, setConflicts] = useState<ValidationConflict[]>([]);
  const [validationConflictDialogOpen, setValidationConflictDialogOpen] =
    useState<boolean>(false);

  const validateLinkedStatements = async (): Promise<boolean> => {
    let valid: boolean = true;

    const _entity: PolicyEntity = getValues();

    let data: Data = {
      id: -1,
      description: "",
      name: _entity.policyname,
      children: selectedStatements.current,
      extra: {
        subject: "Policy",
      },
    };

    await validateData(data).then((conflicts: ValidationConflict[]) => {
      if (conflicts.length > 0) {
        // handleCancelClick();
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
          disabled={!validateButtonEnabled}
          onClick={validateLinkedStatements}
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

  const selectedStatements = useRef<Data[]>([]);

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

    selectedStatements.current = selectionData;

    linkedStatements.current = _selection;
  };

  const renderComponent = () => {
    return (
      <div className="form relative w-[100%] h-[450px] grid grid-rows-[30%_70%]">
        <div>
          <Form />
          <PolicyDataRenderer
            data={tableData}
            columns={columns}
            toolbar={DataTableToolbar}
            selectedIds={linkedStatements.current}
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

export default PolicyForm;
