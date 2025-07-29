import {
  tService,
  tServiceAction,
  tServiceStatement,
  tServiceStatementAction,
} from "@/lib/prisma-types";
import { Data } from "@/lib/types";

/**
 * map serviceactions to Data
 *
 * @param _serviceactions the serviceactions (tServiceAction[])
 *
 * @returns Data[] the mapped data
 */
export const mapServiceActions = (
  _serviceactions: tServiceAction[]
): Data[] => {
  let result: Data[] = _serviceactions.map((_serviceaction: tServiceAction) => {
    let item: Data = {
      id: _serviceaction.id,
      name: _serviceaction.serviceactionname,
      description: "",
      children: [],
    };

    return item;
  });

  return result;
};

/**
 * map services to Data[]
 *
 * @param _services the services (tService[])
 *
 * @returns Data[] the mapped data (with serviceactions as children)
 */
export const mapServices = (_services: tService[]): Data[] => {
  let result: Data[] = _services.map((_service: tService) => {
    let item: Data = {
      id: _service.id,
      name: _service.servicename,
      description: "",
      children: mapServiceActions(_service.serviceactions),
    };

    return item;
  });

  return result;
};

/**
 * map service statement actions to Data[]
 *
 * @param _servicename the service name of the service statement
 * @param _serviceStatementActions the service statement actions (tServiceStatementAction[])
 * @param _permission the _permisssion (ALLOW or DENY)
 * @param _serviceId the service id
 * @param _parent the service statement
 * @returns
 */
const mapServiceStatementActions = (
  _servicename: string,
  _serviceStatementActions: tServiceStatementAction[],
  _permission: string | null,
  _serviceId: number,
  _parent: string
): Data[] => {
  let result: Data[] = [];

  if (_serviceStatementActions) {
    result = _serviceStatementActions.map(
      (serviceStatementAction: tServiceStatementAction) => {
        return {
          id: serviceStatementAction.id,
          name: serviceStatementAction.ssactionname,
          description: "",
          children: [],
          extra: {
            subject: "ServiceStatementAction",
            parent: _parent,
            access: _permission ?? undefined,
            serviceId: _serviceId ?? undefined,
            action: serviceStatementAction.serviceaction.serviceactionname,
            servicename: _servicename,
          },
        };
      }
    );
  }

  return result;
};

/**
 * map service statements to Data[]
 *
 * @param statements the service statements (tServiceStatement[])
 * @param excludeservicestatementactions boolean to exclue service statment actions
 *
 * @returns Data araay of mapped service statements
 */
export const mapServiceStatements = (
  statements: tServiceStatement[],
  excludeservicestatementactions: boolean = false
): Data[] => {
  let result: Data[] = [];

  if (statements) {
    result = statements.map((statement) => {
      return {
        id: statement.id,
        name: statement.ssname,
        description: statement.description,
        children: excludeservicestatementactions
          ? []
          : mapServiceStatementActions(
              statement.service.servicename,
              statement.servicestatementactions,
              statement.permission,
              statement.serviceid,
              statement.ssname
            ),
        extra: {
          subject: "ServiceStatement",
          parent: undefined,
          serviceId: statement.service.id,
          servicename: statement.service.servicename,
          managed: statement.managed ?? undefined,
          access: statement.permission ?? undefined,
        },
      };
    });
  }

  return result;
};
