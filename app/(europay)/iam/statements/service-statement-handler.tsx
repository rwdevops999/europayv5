"use client";

import { mapServiceStatements } from "@/app/client/mapping";
import { deleteServiceStatement } from "@/app/server/service-statements";
import { Permission } from "@/generated/prisma";
import { DATATABLE_ACTION_DELETE } from "@/lib/constants";
import { absoluteUrl, json, showToast } from "@/lib/util";
import {
  tService,
  tServiceStatement,
  tServiceStatementAction,
} from "@/lib/prisma-types";
import { Data, ToastType } from "@/lib/types";
import Button from "@/ui/button";
import PageItemContainer from "@/ui/page-item-container";
import ServiceSelect from "@/ui/service-select";
import TemplateAlert, { tAlert } from "@/ui/template-alert";
import { PaginationState, TableMeta } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "@/ui/datatable/data-table";
import { DataTableToolbar } from "./table/page-data-table-toolbar";
import { columns, initialTableState } from "./table/page-colums";
import ServiceStatementForm, {
  defaultStatementEntity,
  StatementEntity,
} from "./service-statement-form";
import Dialog from "@/ui/dialog";
import { useToastSettings } from "@/hooks/use-toast-settings";

/**
 * is called to providing the UI for handling the statements.
 *
 * @param serviceid: the service id or undefined
 * @param servicestatementid: the service statementid or undefined
 * @param servicestatements : all service statements (with the service statement actions and linked service actions)
 * @param services : all services (with all linked service actions)
 * @returns
 */
const ServiceStatementHandler = ({
  serviceid,
  servicestatementid,
  servicestatements,
  services,
}: {
  serviceid: number | undefined;
  servicestatementid: number | undefined;
  servicestatements: tServiceStatement[];
  services: tService[];
}) => {
  const { push } = useRouter();
  const { getToastDuration } = useToastSettings();

  const [tableData, setTableData] = useState<Data[]>([]);

  /**
   * if we have a statementid, we select that statement for displaying in the data table.
   * if statementid is undefined, we show all statements in the data table
   */
  const initialise = (): void => {
    if (serviceid) {
      const statements: tServiceStatement[] = servicestatements.flatMap(
        (statement: tServiceStatement) =>
          statement.serviceid === serviceid ? [statement] : []
      );

      setTableData(mapServiceStatements(statements));
    } else if (servicestatementid) {
      const statement: tServiceStatement | undefined = servicestatements.find(
        (statement: tServiceStatement) => statement.id === servicestatementid
      );
      if (statement) {
        setTableData(mapServiceStatements([statement]));
      }
    } else {
      setTableData(mapServiceStatements(servicestatements));
    }
  };

  useEffect(() => {
    initialise();
  }, [servicestatements]);

  /**
   * If we change the service (serviceId or undefined when selected all), we should reload the service statements because someone
   * can have removed some statements from that service.
   *
   * @param _serviceId
   */
  const handleChangeService = (_serviceId: number | undefined): void => {
    push(
      absoluteUrl(
        `/iam/statements/id=${servicestatementid}&serviceid=${_serviceId}`
      )
    );
  };

  const handleOpenDialog = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "statementdialog"
    ) as HTMLDialogElement;

    dialog.showModal();
  };

  const [openDialog, setOpenDialog] = useState<number>(0);

  useEffect(() => {
    if (openDialog > 0) {
      handleOpenDialog();
    }
  }, [openDialog]);

  const [entity, setEntity] = useState<StatementEntity>(defaultStatementEntity);
  const [linkedActions, setLinkedActions] = useState<number[]>([]);

  const handleSetEntityAndOpenDialog = (): void => {
    let entity = { ...defaultStatementEntity };

    if (serviceid) {
      entity = { ...entity, serviceid: serviceid };
    }

    setEntity(entity);
    setLinkedActions([]);

    openTheDialog();
  };

  const openTheDialog = (): void => {
    setOpenDialog((x: number) => x + 1);
  };

  const [alert, setAlert] = useState<tAlert | undefined>(undefined);

  const processDeletedStatement = (_ssname: string): void => {
    showToast(
      ToastType.SUCCESS,
      `Deleted statement ${_ssname}`,
      getToastDuration()
    );

    if (tableData.length === 1) {
      push(absoluteUrl(`/iam/statements/id`));
    } else {
      push(absoluteUrl(`/iam/statements/serviceid=${serviceid}`));
    }
  };

  const isStatementInPolicy = (
    _statementId: number,
    _template: string
  ): tAlert | undefined => {
    const _statement: tServiceStatement | undefined = servicestatements.find(
      (statement: tServiceStatement) => statement.id === _statementId
    );

    let alert: tAlert | undefined = undefined;

    if (
      _statement !== undefined &&
      _statement.policies &&
      _statement.policies.length > 0
    ) {
      alert = {
        template: _template,
        params: {
          iamType: "Service Statement",
          linkedType: `Policy ${_statement.policies[0].name}`,
        },
      };
    }

    return alert;
  };

  const handleAction = async (action: string, statement: Data) => {
    if (action === DATATABLE_ACTION_DELETE) {
      if (statement.extra?.managed) {
        // replace this allowedToDeleteManaged by $iam function
        const allowedToDeleteManaged: boolean = false;

        if (allowedToDeleteManaged) {
          const alert: tAlert | undefined = isStatementInPolicy(
            statement.id,
            "UNABLE_TO_DELETE_LINKED"
          );
          if (!alert) {
            await deleteServiceStatement(statement.id).then(() =>
              processDeletedStatement(statement.name)
            );
          } else {
            setAlert(alert);
          }
        } else {
          const alert: tAlert = {
            template: "UNABLE_TO_DELETE_MANAGED",
            params: { iamType: "Service Statement" },
          };
          setAlert(alert);
        }
      } else {
        const alert: tAlert | undefined = isStatementInPolicy(
          statement.id,
          "UNABLE_TO_DELETE_LINKED"
        );
        if (!alert) {
          await deleteServiceStatement(statement.id).then(() =>
            processDeletedStatement(statement.name)
          );
        } else {
          setAlert(alert);
        }
      }
    } else {
      const stat: tServiceStatement | undefined = servicestatements.find(
        (_statement: tServiceStatement) => _statement.id === statement.id
      );

      if (stat) {
        const entity: StatementEntity = {
          id: stat.id,
          ssname: stat.ssname,
          description: stat.description ?? "",
          managed: stat.managed ?? false,
          permission: stat.permission ?? Permission.ALLOW,
          serviceid: stat.serviceid,
        };

        const linked: number[] = stat.servicestatementactions.map(
          (action: tServiceStatementAction) => action.serviceaction.id
        );

        setEntity(entity);
        setLinkedActions(linked);

        openTheDialog();
      }
    }
  };

  const tableMeta: TableMeta<Data[]> = {
    handleAction: handleAction,
    // user: user,
  };

  const renderComponent = () => {
    return (
      <div
        data-testid="service-statements"
        id="service-statements"
        className="w-[99vw] h-[83vh] rounded-sm grid items-start gap-2 grid-cols-1 grid-rows-10 overflow-y-scroll"
      >
        <PageItemContainer title="control" border={false}>
          <div className="flex items-center space-x-2 justify-between">
            <ServiceSelect
              addAllItem
              defaultService={serviceid}
              changeServiceHandler={handleChangeService}
              services={services}
            />
            <Button
              name="create statement"
              intent={"warning"}
              size={"small"}
              style={"soft"}
              onClick={handleSetEntityAndOpenDialog}
            />
          </div>
          <div>
            <Dialog
              title={"Create service statement for selected service"}
              id="statementdialog"
              form={
                <ServiceStatementForm
                  services={services}
                  entity={entity}
                  linkedactions={linkedActions}
                />
              }
              className="w-11/12 max-w-6xl"
            />
          </div>
        </PageItemContainer>
        <PageItemContainer title="service statements">
          <DataTable
            id="DataTableServiceStatementHandler"
            data={tableData}
            columns={columns}
            tablemeta={tableMeta}
            Toolbar={DataTableToolbar}
            expandAll={servicestatementid === undefined ? false : true}
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

export default ServiceStatementHandler;
