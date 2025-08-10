"use client";

import { tPolicy, tService, tServiceStatement } from "@/lib/prisma-types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PolicyForm, { defaultPolicyEntity, PolicyEntity } from "./policy-form";
import { Data, ToastType } from "@/lib/types";
import { mapPolicies } from "@/app/client/mapping";
import TemplateAlert, { tAlert } from "@/ui/template-alert";
import { absoluteUrl, showToast } from "@/lib/functions";
import { DATATABLE_ACTION_DELETE } from "@/lib/constants";
import { deletePolicy } from "@/app/server/policies";
import { TableMeta } from "@tanstack/react-table";
import PageItemContainer from "@/ui/page-item-container";
import ServiceSelect from "@/ui/service-select";
import Button from "@/ui/button";
import Dialog from "@/ui/dialog";
import { DataTable } from "@/ui/datatable/data-table";
import { columns } from "./table/dialog-columns";
import { DataTableToolbar } from "./table/dialog-data-table-toolbar";
import { useToastSettings } from "@/hooks/use-toast-settings";

// import { Data, ToastType } from "@/app/lib/types";
// import { absoluteUrl, json, showToast } from "@/app/lib/util";
// import Button from "@/app/ui/button";
// import PageItemContainer from "@/app/ui/page-item-container";
// import ServiceSelect from "@/app/ui/service-select";
// import { useEffect, useState } from "react";
// import { mapPolicies } from "../../scripts/client/mappings";
// import { DataTable } from "@/app/ui/datatable/data-table";
// import { columns } from "./table/page-colums";
// import { TableMeta } from "@tanstack/react-table";
// import { DataTableToolbar } from "./table/page-data-table-toolbar";
// import { useRouter } from "next/navigation";
// import PolicyForm, { defaultPolicyEntity, PolicyEntity } from "./policy-form";
// import Dialog from "@/app/ui/dialog";
// import { DATATABLE_ACTION_DELETE } from "@/app/ui/datatable/data-table-row-actions";
// import { deletePolicy } from "../../scripts/server/iam/policies";
// import { tPolicy, tService, tServiceStatement } from "@/app/lib/prisma-types";
// import AlertWithTemplate, { tAlert } from "@/app/ui/alert-with-template";
// import { useToastSettings } from "@/app/hooks/use-toast-settings";

/**
 * is called to providing the UI for handling the policies.
 *
 * @param serviceid: the service id or undefined
 * @param policyid: the policyid or undefined
 * @param policies : all policies (with the service statement actions and linked service)
 * @param services : all services (with all linked service actions)
 * @param servicestatements : all service statements
 * @returns
 */
const PolicyHandler = ({
  serviceid,
  policyid,
  policies,
  services,
  servicestatements,
}: {
  serviceid: number | undefined;
  policyid: number | undefined;
  policies: tPolicy[];
  services: tService[];
  servicestatements: tServiceStatement[];
}) => {
  const { push } = useRouter();
  const { getToastDuration } = useToastSettings();

  const [entity, setEntity] = useState<PolicyEntity>(defaultPolicyEntity);
  const [linkedStatements, setLinkedStatements] = useState<number[]>([]);

  const [tableData, setTableData] = useState<Data[]>([]);

  const initialise = (): void => {
    let policiesToMap: tPolicy[] = policies;

    if (serviceid) {
      // get all policies which contain service statements from that service
      policiesToMap = policies
        .filter((_policy: tPolicy) => _policy.servicestatements.length > 0)
        .filter(
          (_policy: tPolicy) =>
            _policy.servicestatements[0].serviceid === serviceid
        );
    } else if (policyid) {
      // map policy whith that id
      const affectedPolicy: tPolicy | undefined = policies.find(
        (_policy: tPolicy) => _policy.id === policyid
      );
      if (affectedPolicy) {
        policiesToMap = [affectedPolicy];
      }
    }

    setTableData(mapPolicies(policiesToMap, services));
  };

  useEffect(() => {
    initialise();
  }, [policies]);

  const [alert, setAlert] = useState<tAlert | undefined>(undefined);

  const processDeletedPolicy = (_name: string): void => {
    showToast(ToastType.SUCCESS, `Deleted policy ${_name}`, getToastDuration());

    if (tableData.length === 1) {
      push(absoluteUrl(`/iam/policies/id`));
    } else {
      push(absoluteUrl(`/iam/policies/serviceid=${serviceid}`));
    }
  };

  const policyInDependency = (
    _policyId: number,
    _template: string
  ): tAlert | undefined => {
    let alert: tAlert | undefined = undefined;

    const _policy: tPolicy | undefined = policies.find(
      (policy: tPolicy) => policy.id === _policyId
    );

    if (_policy !== undefined) {
      if (_policy.roles && _policy.roles.length > 0) {
        alert = {
          template: _template,
          params: {
            iamType: "Policy",
            linkedType: `Role ${_policy.roles[0].name}`,
          },
        };
      } else if (_policy.users && _policy.users.length > 0) {
        alert = {
          template: _template,
          params: {
            iamType: "Policy",
            linkedType: `User ${_policy.users[0].firstname} ${_policy.users[0].lastname}`,
          },
        };
      } else if (_policy.groups && _policy.groups.length > 0) {
        alert = {
          template: _template,
          params: {
            iamType: "Policy",
            linkedType: `Group ${_policy.groups[0].name}`,
          },
        };
      }
    }

    return alert;
  };

  const handleAction = async (action: string, policy: Data) => {
    if (action === DATATABLE_ACTION_DELETE) {
      if (policy.extra?.managed) {
        // replace this allowedToDeleteManaged by $iam function
        const allowedToDeleteManaged: boolean = false;

        if (allowedToDeleteManaged) {
          const alert: tAlert | undefined = policyInDependency(
            policy.id,
            "UNABLE_TO_DELETE_LINKED"
          );

          if (!alert) {
            await deletePolicy(policy.id).then(() =>
              processDeletedPolicy(policy.name)
            );
          } else {
            setAlert(alert);
          }
        } else {
          const alert: tAlert = {
            template: "UNABLE_TO_DELETE_MANAGED",
            params: { iamType: "Policy" },
          };
          setAlert(alert);
        }
      } else {
        const alert: tAlert | undefined = policyInDependency(
          policy.id,
          "UNABLE_TO_DELETE_LINKED"
        );

        if (!alert) {
          await deletePolicy(policy.id).then(() =>
            processDeletedPolicy(policy.name)
          );
        } else {
          setAlert(alert);
        }
      }
    } else {
      const alert: tAlert | undefined = policyInDependency(
        policy.id,
        "UNABLE_TO_UPDATE_LINKED"
      );

      if (alert) {
        setAlert(alert);
      } else {
        const pol: tPolicy | undefined = policies.find(
          (_policy: tPolicy) => _policy.id === policy.id
        );
        if (pol) {
          const entity: PolicyEntity = {
            id: pol.id,
            policyname: pol.name,
            description: pol.description ?? "",
            managed: pol.managed ?? false,
            serviceid:
              pol.servicestatements.length > 0
                ? pol.servicestatements[0].serviceid
                : undefined,
          };

          const linked: number[] = pol.servicestatements.map(
            (statement: tServiceStatement) => statement.id
          );
          setEntity(entity);
          setLinkedStatements(linked);
          openTheDialog();
        }
      }
    }
  };

  const tableMeta: TableMeta<Data[]> = {
    handleAction: handleAction,
    // user: user,
  };

  const handleChangeService = (_serviceId: number | undefined): void => {
    push(absoluteUrl(`/iam/policies/serviceid=${_serviceId}`));
  };

  const [openDialog, setOpenDialog] = useState<number>(0);

  const handleOpenDialog = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "policydialog"
    ) as HTMLDialogElement;

    dialog.showModal();
  };

  useEffect(() => {
    if (openDialog > 0) {
      handleOpenDialog();
    }
  }, [openDialog]);

  const handleSetEntityAndOpenDialog = (): void => {
    let entity = { ...defaultPolicyEntity };

    if (serviceid) {
      entity = { ...entity, serviceid: serviceid };
    }

    setEntity(entity);
    setLinkedStatements([]);

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
            <ServiceSelect
              addAllItem
              services={services}
              defaultService={serviceid}
              changeServiceHandler={handleChangeService}
            />
            <Button
              name="create policy"
              intent={"warning"}
              size={"small"}
              style={"soft"}
              onClick={handleSetEntityAndOpenDialog}
            />
          </div>
          <div>
            <Dialog
              title={"Create policy for selected service"}
              id="policydialog"
              form={
                <PolicyForm
                  services={services}
                  servicestatements={servicestatements}
                  entity={entity}
                  linkedstatements={linkedStatements}
                />
              }
              className="w-11/12 max-w-6xl absolute -z-10"
            />
          </div>
        </PageItemContainer>
        <PageItemContainer title="policies">
          <DataTable
            data={tableData}
            columns={columns}
            tablemeta={tableMeta}
            Toolbar={DataTableToolbar}
            expandAll={policyid === undefined ? false : true}
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

export default PolicyHandler;
