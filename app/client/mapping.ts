import {
  tPolicy,
  tRole,
  tService,
  tServiceAction,
  tServiceStatement,
  tServiceStatementAction,
  tUser,
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

/**
 * map policies to Data[]. the children are the service statements
 *
 * @param _policies the policies
 * @param _services the services
 *
 * @returns a Data[] array
 */
export const mapPolicies = (
  _policies: tPolicy[],
  _services?: tService[]
): Data[] => {
  let result: Data[] = [];

  if (_policies) {
    let servicename: string;

    result = _policies.map((_policy: tPolicy) => {
      if (_policy.servicestatements.length >= 0) {
        servicename = _policy.servicestatements[0].service.servicename;
      }

      return {
        id: _policy.id,
        name: _policy.name!,
        description: _policy.description,
        children: mapServiceStatements(_policy.servicestatements),
        extra: {
          subject: "Policy",
          servicename: servicename,
          managed: _policy.managed ?? undefined,
        },
      };
    });
  }

  return result;
};

export const mapRoles = (roles: tRole[]): Data[] => {
  let result: Data[] = [];

  if (roles) {
    result = roles.map((role) => {
      return {
        id: role.id,
        name: role.name!,
        description: role.description!,
        children: mapPolicies(role.policies),
        extra: {
          subject: "Role",
          managed: role.managed ?? undefined,
        },
      };
    });
  }

  return result;
};

export const mapUsers = (users: tUser[]): Data[] => {
  let data: Data[] = [];

  data = users.map((user: tUser) => {
    return {
      id: user.id!,
      name: user.lastname === "" ? user.email : user.lastname,
      description: user.firstname === "" ? "" : user.firstname,
      children: [
        ...mapPolicies(user.policies),
        ...mapRoles(user.roles),
        // ...mapGroupsSimple(user.groups),
      ],
      extra: {
        subject: "User",
        additional: user.blocked,
        managed: user.managed ?? undefined,
      },
    };
  });

  return data;
};
