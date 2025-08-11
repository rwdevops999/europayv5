"use server";

import {
  tGroup,
  tPolicy,
  tRole,
  tServiceStatement,
  tServiceStatementAction,
  tUser,
} from "@/lib/prisma-types";
import { loadServiceStatements } from "./service-statements";
import { loadPolicies } from "./policies";
import { loadRoles } from "./roles";
import { loadUsers } from "./users";
import { loadGroups } from "./groups";
import {
  GroupForExport,
  PolicyForExport,
  RoleForExport,
  ServiceStatementActionForExport,
  ServiceStatementForExport,
  UserForExport,
  UserForGroupForExport,
} from "./data/exportdata";
import { Export, Permission } from "@/generated/prisma";
import { DEFAULT_COUNTRY } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { JsonValue } from "@/generated/prisma/runtime/library";

const exportServiceStatementActions = (
  _actions: tServiceStatementAction[],
  _exportData: string[]
): string[] => {
  _actions.forEach((_action: tServiceStatementAction) => {
    const exportString: string = `[SERVICE STATEMENT ACTION] SERVICE ACTION: ${_action.serviceaction.serviceactionname}`;

    _exportData.push(exportString);
  });

  return _exportData;
};

export const exportServiceStatements = async (): Promise<string[]> => {
  const statements: tServiceStatement[] = await loadServiceStatements();

  let exportData: string[] = [];

  statements.forEach((_statement: tServiceStatement) => {
    const exportString: string = `[SERVICE STATEMENT] ${
      _statement.managed ? "Ⓜ️\t" : " \t"
    } (${_statement.permission?.toLocaleUpperCase()}) NAME: ${
      _statement.ssname
    } DESCRIPTION: ${_statement.description} SERVICE: ${
      _statement.service.servicename
    }`;

    exportData.push(exportString);

    exportData = exportServiceStatementActions(
      _statement.servicestatementactions,
      exportData
    );
  });

  return exportData;
};

const exportServiceStatementsShort = (
  _statements: tServiceStatement[],
  _exportData: string[]
): string[] => {
  _statements.forEach((_statement: tServiceStatement) => {
    const exportString: string = `[SERVICE STATEMENT] NAME: ${_statement.ssname}`;

    _exportData.push(exportString);
  });

  return _exportData;
};

export const exportPolicies = async (): Promise<string[]> => {
  const policies: tPolicy[] = await loadPolicies();

  let exportData: string[] = [];

  policies.forEach((_policy: tPolicy) => {
    const exportString: string = `[POLICY] ${
      _policy.managed ? "Ⓜ️\t" : " \t"
    } NAME: ${_policy.name} DESCRIPTION: ${_policy.description}`;

    exportData.push(exportString);
    exportData = exportServiceStatementsShort(
      _policy.servicestatements,
      exportData
    );
  });

  return exportData;
};

const exportPoliciesShort = (
  _policies: tPolicy[],
  _exportData: string[]
): string[] => {
  _policies.forEach((_policy: tPolicy) => {
    const exportString: string = `[POLICY] NAME: ${_policy.name}`;

    _exportData.push(exportString);
  });

  return _exportData;
};

export const exportRoles = async (): Promise<string[]> => {
  const roles: tRole[] = await loadRoles();

  let exportData: string[] = [];

  roles.forEach((_role: tRole) => {
    const exportString: string = `[ROLE] ${
      _role.managed ? "Ⓜ️\t" : " \t"
    } NAME: ${_role.name} DESCRIPTION: ${_role.description}`;

    exportData.push(exportString);

    exportData = exportPoliciesShort(_role.policies, exportData);
  });

  return exportData;
};

const exportRolesShort = (_roles: tRole[], _exportData: string[]): string[] => {
  _roles.forEach((_role: tRole) => {
    const exportString: string = `[ROLE] NAME: ${_role.name}`;

    _exportData.push(exportString);
  });

  return _exportData;
};

export const exportUsers = async (): Promise<string[]> => {
  const users: tUser[] = await loadUsers();

  let exportData: string[] = [];

  users.forEach((_user: tUser) => {
    const exportString: string = `[USER] ${_user.managed ? "Ⓜ️\t" : " \t"} ${
      _user.blocked ? "🔒\t" : " \t"
    } USERNAME: ${_user.username} LASTNAME: ${_user.lastname} FIRSTNAME: ${
      _user.firstname
    } EMAIL: ${_user.email} PASSWORD: ******** PASSWORDLESS: ${
      _user.passwordless ? true : false
    } TYPE: ${_user.type} COUNTRY: ${_user.address?.country?.name}`;

    exportData.push(exportString);

    exportData = exportPoliciesShort(_user.policies, exportData);
    exportData = exportRolesShort(_user.roles, exportData);
  });

  return exportData;
};

const exportUsersShort = (_users: tUser[], _exportData: string[]): string[] => {
  _users.forEach((_user: tUser) => {
    const exportString: string = `[USER] LASTNAME: ${_user.lastname} FIRSTNAME: ${_user.firstname}`;

    _exportData.push(exportString);
  });

  return _exportData;
};

export const exportGroups = async (): Promise<string[]> => {
  const groups: tGroup[] = await loadGroups();

  let exportData: string[] = [];

  groups.forEach((_group: tGroup) => {
    const exportString: string = `[GROUP] ${
      _group.managed ? "Ⓜ️\t" : " \t"
    } NAME: ${_group.name} DESCRIPTION: ${_group.description}`;

    exportData.push(exportString);

    exportData = exportPoliciesShort(_group.policies, exportData);
    exportData = exportRolesShort(_group.roles, exportData);
    exportData = exportUsersShort(_group.users, exportData);
  });

  return exportData;
};

const provisionServiceStatementActions = (
  _actions: tServiceStatementAction[],
  _json: ServiceStatementForExport
): ServiceStatementForExport => {
  _actions.forEach((_action: tServiceStatementAction) => {
    const json: ServiceStatementActionForExport = {
      name: _action.ssactionname,
      serviceaction: _action.serviceaction.serviceactionname,
    };

    _json.servicestatementactions?.push(json);
  });

  return _json;
};

const provisionServiceStatements = async (_exportData: any): Promise<any> => {
  const statements: tServiceStatement[] = await loadServiceStatements();

  statements.forEach((_statement: tServiceStatement) => {
    let json: ServiceStatementForExport = {
      name: _statement.ssname,
      description: _statement.description ?? "",
      managed: _statement.managed ?? false,
      permission: _statement.permission ?? Permission.ALLOW,
      servicename: _statement.service.servicename,
      servicestatementactions: [],
    };

    json = provisionServiceStatementActions(
      _statement.servicestatementactions,
      json
    );

    _exportData.servicestatements.push(json);
  });

  return _exportData;
};

const provisionPolicies = async (_exportData: any): Promise<any> => {
  const policies: tPolicy[] = await loadPolicies();

  policies.forEach((_policy: tPolicy) => {
    const json: PolicyForExport = {
      name: _policy.name,
      description: _policy.description ?? "",
      managed: _policy.managed ?? false,
      servicestatements: _policy.servicestatements.map(
        (_ss: tServiceStatement) => _ss.ssname
      ),
    };

    _exportData.policies.push(json);
  });

  return _exportData;
};

const provisionRoles = async (_exportData: any): Promise<any> => {
  const roles: tRole[] = await loadRoles();

  roles.forEach((_role: tRole) => {
    const json: RoleForExport = {
      name: _role.name,
      description: _role.description ?? "",
      managed: _role.managed ?? false,
      policies: _role.policies.map((_pol: tPolicy) => _pol.name),
    };

    _exportData.roles.push(json);
  });

  return _exportData;
};

const provisionUsers = async (_exportData: any): Promise<any> => {
  const users: tUser[] = await loadUsers();

  users.forEach((_user: tUser) => {
    const json: UserForExport = {
      username: _user.username ?? "",
      firstname: _user.firstname,
      lastname: _user.lastname,
      email: _user.email,
      password: _user.password,
      passwordless: _user.passwordless ?? false,
      managed: _user.managed ?? false,
      blocked: _user.blocked ?? false,
      type: _user.type,
      country: _user.address?.country?.name ?? DEFAULT_COUNTRY,
      policies: _user.policies.map((_pol: tPolicy) => _pol.name),
      roles: _user.roles.map((_role: tRole) => _role.name),
    };

    _exportData.users.push(json);
  });

  return _exportData;
};

const provisionGroups = async (_exportData: any): Promise<any> => {
  const groups: tGroup[] = await loadGroups();

  groups.forEach((_group: tGroup) => {
    const json: GroupForExport = {
      name: _group.name,
      description: _group.description ?? "",
      managed: _group.managed ?? false,
      policies: _group.policies.map((_pol: tPolicy) => _pol.name),
      roles: _group.roles.map((_role: tRole) => _role.name),
      users: _group.users.map((_user: tUser) => {
        let usershort: UserForGroupForExport = {
          firstname: _user.firstname,
          lastname: _user.lastname,
        };

        return usershort;
      }),
    };

    _exportData.groups.push(json);
  });

  return _exportData;
};

export const exportServices = async (services: string[]): Promise<any> => {
  let exportData: any = {
    servicestatements: [],
    policies: [],
    roles: [],
    users: [],
    groups: [],
  };

  for (let i = 0; i < services.length; i++) {
    const _service: string = services[i];

    switch (_service) {
      case "statements":
        exportData = await provisionServiceStatements(exportData);
        break;
      case "policies":
        exportData = await provisionPolicies(exportData);
        break;
      case "roles":
        exportData = await provisionRoles(exportData);
        break;
      case "users":
        exportData = await provisionUsers(exportData);
        break;
      case "groups":
        exportData = await provisionGroups(exportData);
        break;
    }
  }

  return exportData;
};

const getTheExportByName = async (_name: string): Promise<Export | null> => {
  let result: Export | null = null;

  await prisma.export
    .findFirst({
      where: {
        name: _name,
      },
    })
    .then((value: Export | null) => (result = value));

  return result;
};

const createExportData = async (_name: string, _data: any): Promise<void> => {
  await prisma.export.create({
    data: {
      name: _name,
      content: _data,
    },
  });
};

const updateExportData = async (_id: number, _data: any): Promise<void> => {
  await prisma.export.update({
    where: {
      id: _id,
    },
    data: {
      content: _data,
    },
  });
};

export const exportDataToDB = async (
  _name: string,
  _data: any
): Promise<void> => {
  const entry: Export | null = await getTheExportByName(_name);

  if (entry) {
    updateExportData(entry.id, _data);
  } else {
    createExportData(_name, _data);
  }
};

export const loadExportNames = async (): Promise<string[]> => {
  let result: string[] = [];

  await prisma.export
    .findMany({
      select: {
        name: true,
      },
    })
    .then((values: any[]) => {
      result = values.reduce<string[]>((acc: string[], value: any) => {
        if (!acc.includes(value.name)) {
          acc.push(value.name);
        }

        return acc;
      }, []);
    });

  return result;
};

export const loadExportedData = async (
  _name: string
): Promise<JsonValue | null> => {
  let result: JsonValue | null = null;

  await prisma.export
    .findUnique({
      where: {
        name: _name,
      },
      select: {
        content: true,
      },
    })
    .then((value: any | null) => {
      if (value) {
        result = value.content;
      }
    });

  return result;
};
