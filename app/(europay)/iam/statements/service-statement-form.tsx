"use client";

import { mapServiceActions } from "@/app/client/mapping";
import {
  createServiceStatement,
  updateServiceStatement,
} from "@/app/server/service-statements";
import { Permission } from "@/generated/prisma";
import { absoluteUrl, cn, showToast } from "@/lib/util";
import { displayPrismaErrorCode } from "@/lib/prisma-errors";
import {
  tService,
  tServiceStatementCreate,
  tServiceStatementUpdate,
} from "@/lib/prisma-types";
import { Data, ToastType } from "@/lib/types";
import AllowDenySwitch from "@/ui/allow-deny-switch";
import Button from "@/ui/button";
import ServiceSelect from "@/ui/service-select";
import { JSX, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToastSettings } from "@/hooks/use-toast-settings";
import ServiceStatementDataRenderer from "./service-statement-data-renderer";
import { columns } from "./table/dialog-columns";
import { DataTableToolbar } from "./table/dialog-data-table-toolbar";

export interface StatementEntity {
  id?: number; // statement id
  ssname: string;
  description: string;
  permission: Permission;
  managed: boolean;
  serviceid: number;
}

export const defaultStatementEntity: StatementEntity = {
  ssname: "",
  description: "",
  permission: Permission.ALLOW,
  managed: false,
  serviceid: 0,
};

export interface StatementFormProps {
  services: tService[];
  entity: StatementEntity;
  linkedactions: number[];
}

const ServiceStatementForm = (props: StatementFormProps) => {
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

  const selectedActions = useRef<Data[]>([]);

  const provisionStatementForCreate = (
    _entity: StatementEntity
  ): tServiceStatementCreate => {
    const result: tServiceStatementCreate = {
      ssname: _entity.ssname,
      description: _entity.description,
      permission: _entity.permission,
      managed: _entity.managed,
      serviceid: _entity.serviceid,
      servicestatementactions: {
        create: selectedActions.current.map((_action: Data) => {
          return {
            ssactionname: _entity.ssname,
            serviceactionid: _action.id,
          };
        }),
      },
    };

    return result;
  };

  const provisionStatementForUpdate = (
    _entity: StatementEntity
  ): tServiceStatementUpdate => {
    const result: tServiceStatementUpdate = {
      id: _entity.id,
      ssname: _entity.ssname,
      description: _entity.description,
      permission: _entity.permission,
      managed: _entity.managed,
      serviceid: _entity.serviceid,
      servicestatementactions: {
        deleteMany: {
          statementid: _entity.id,
        },
        create: selectedActions.current.map((_action: Data) => {
          return {
            ssactionname: _entity.ssname,
            serviceaction: {
              connect: {
                id: _action.id,
              },
            },
          };
        }),
      },
    };

    return result;
  };

  const handleCreateStatement = async (
    _entity: StatementEntity
  ): Promise<void> => {
    handleCancelClick();
    const statement: tServiceStatementCreate =
      provisionStatementForCreate(_entity);

    await createServiceStatement(statement).then(
      (errorcode: string | undefined) => {
        if (errorcode) {
          showToast(
            ToastType.ERROR,
            `Statement create error ${displayPrismaErrorCode(errorcode)}`,
            getToastDuration()
          );
          // show a toast here about error
          displayPrismaErrorCode(errorcode);
        } else {
          showToast(
            ToastType.SUCCESS,
            `Statement ${statement.ssname} created`,
            getToastDuration()
          );
          push(absoluteUrl(`/iam/statements/id`));
          handleCancelClick();
        }
      }
    );
  };

  const handleUpdateStatement = async (
    _entity: StatementEntity
  ): Promise<void> => {
    const statement: tServiceStatementUpdate =
      provisionStatementForUpdate(_entity);

    await updateServiceStatement(statement).then(
      (errorcode: string | undefined) => {
        if (errorcode) {
          showToast(
            ToastType.ERROR,
            `Statement update error ${displayPrismaErrorCode(errorcode)}`,
            getToastDuration()
          );
          // show a toast here about error
          displayPrismaErrorCode(errorcode);
        } else {
          showToast(
            ToastType.SUCCESS,
            `Statement ${statement.ssname} updated`,
            getToastDuration()
          );
          push(absoluteUrl(`/iam/statements/id`));
          handleCancelClick();
        }
      }
    );
  };

  const onSubmit: SubmitHandler<StatementEntity> = async (
    formData: StatementEntity
  ) => {
    formData = { ...formData, serviceid: selectedServiceId.current! };

    if (formData.id) {
      await handleUpdateStatement(formData);
    } else {
      await handleCreateStatement(formData);
    }
  };

  const handleCancelClick = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "statementdialog"
    ) as HTMLDialogElement;

    dialog.close();
  };

  const processTableData = (_serviceId: number | undefined): void => {
    if (_serviceId) {
      const service: tService | undefined = props.services.find(
        (_service: tService) => _service.id === _serviceId
      );

      if (service) {
        setTableData(mapServiceActions(service.serviceactions));
      }
    } else {
      setTableData([]);
    }
  };

  const linkedActions = useRef<number[]>([]);

  useEffect(() => {
    if (props.entity.serviceid) {
      selectedServiceId.current = props.entity.serviceid;
      processTableData(props.entity.serviceid);
    } else {
      selectedServiceId.current = props.services[0].id;
      processTableData(props.services[0].id);
    }
    linkedActions.current = props.linkedactions;
    setFormButtonEnabled(props.linkedactions.length > 0);
    reset(props.entity);
    // setManaged(getValues("managed"));
    setPermission(getValues("permission"));
  }, [props]);

  const selectedServiceId = useRef<number | undefined>(undefined);

  const handleChangeService = (_serviceId: number | undefined): void => {
    selectedServiceId.current = _serviceId;
    processTableData(_serviceId);
  };

  const [permission, setPermission] = useState<string>(Permission.ALLOW);

  const changePermission = (value: string) => {
    setPermission(value);
    setValue(
      "permission",
      value === "ALLOW" ? Permission.ALLOW : Permission.DENY
    );
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
      focus("statementname");
    }, []);

    return (
      <div className="ml-1 grid grid-rows-[25%_25%_25%_25%] gap-y-1 mt-0.75">
        <div className="grid grid-cols-[10%_40%_10%_40%] gap-y-1 mt-0.75">
          <label className="mt-1">Name:</label>
          <input
            id="statementname"
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
            {...register("ssname")}
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
          <label className="flex items-center">Access:</label>
          <AllowDenySwitch
            value={permission}
            accessFn={changePermission}
            className="flex items-center mt-1"
          />
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

  const FormButtons = (): JSX.Element => {
    return (
      <div className="flex flex-col space-y-1.5">
        <Button
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
            name="Create"
            intent={"neutral"}
            style={"soft"}
            size={"small"}
            className="bg-custom"
            type="submit"
            disabled={!formButtonEnabled}
          />
        )}
        {props.entity.id && (
          <Button
            name="Update"
            intent={"neutral"}
            style={"soft"}
            size={"small"}
            className="bg-custom"
            type="submit"
            disabled={!formButtonEnabled}
          />
        )}
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

  const [formButtonEnabled, setFormButtonEnabled] = useState<boolean>(false);

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

    selectedActions.current = selectionData;

    linkedActions.current = _selection;

    setFormButtonEnabled(_selection.length > 0);
  };

  const renderComponent = () => {
    return (
      <div className="form relative w-[100%] h-[450px] grid grid-rows-[30%_70%]">
        <Form />
        <ServiceStatementDataRenderer
          data={tableData}
          columns={columns}
          toolbar={DataTableToolbar}
          selectedIds={linkedActions.current}
          changeSelection={handleSelectionChanged}
        />
      </div>
    );
  };

  return <>{renderComponent()}</>;
};

export default ServiceStatementForm;
