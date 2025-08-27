"use server";

import { Permission, UserType } from "@/generated/prisma";
import { cleanDbTables } from "./app-tables";
import {
  GroupForExport,
  IamData,
  PolicyForExport,
  RoleForExport,
  ServiceStatementActionForExport,
  ServiceStatementForExport,
  UserForExport,
  UserForGroupForExport,
} from "./data/exportdata";
import prisma from "@/lib/prisma";
import { encrypt } from "./encrypt";

const createServiceStatement = async (
  _serviceStatement: ServiceStatementForExport
): Promise<void> => {
  const permission: string = _serviceStatement.permission ?? "ALLOW";

  await prisma.serviceStatement.create({
    data: {
      ssname: _serviceStatement.name,
      description: _serviceStatement.description,
      permission: permission === "ALLOW" ? Permission.ALLOW : Permission.DENY,
      managed: _serviceStatement.managed,
      service: {
        connect: {
          servicename: _serviceStatement.servicename,
        },
      },
      servicestatementactions: {
        create: _serviceStatement.servicestatementactions?.map(
          (_servicestatementaction: ServiceStatementActionForExport) => {
            return {
              ssactionname: _servicestatementaction.name,
              serviceaction: {
                connect: {
                  serviceactionname: _servicestatementaction.serviceaction,
                },
              },
            };
          }
        ),
      },
    },
  });
};

const createServiceStatements = async (
  serviceStatements: ServiceStatementForExport[]
): Promise<void> => {
  for (let i = 0; i < serviceStatements.length; i++) {
    await createServiceStatement(serviceStatements[i]);
  }
};

const createPolicy = async (_policy: PolicyForExport): Promise<void> => {
  await prisma.policy.create({
    data: {
      name: _policy.name,
      description: _policy.description,
      managed: _policy.managed,
      servicestatements: {
        connect: _policy.servicestatements.map((_servicestatement: string) => {
          return {
            ssname: _servicestatement,
          };
        }),
      },
    },
  });
};

const createPolicies = async (policies: PolicyForExport[]): Promise<void> => {
  for (let i = 0; i < policies.length; i++) {
    await createPolicy(policies[i]);
  }
};

const createRole = async (_role: RoleForExport): Promise<void> => {
  await prisma.role.create({
    data: {
      name: _role.name,
      description: _role.description,
      managed: _role.managed,
      policies: {
        connect: _role.policies.map((_policy: string) => {
          return {
            name: _policy,
          };
        }),
      },
    },
  });
};

const createRoles = async (roles: RoleForExport[]): Promise<void> => {
  for (let i = 0; i < roles.length; i++) {
    await createRole(roles[i]);
  }
};

const createUser = async (_user: UserForExport): Promise<void> => {
  var usertype: UserType = UserType[_user.type as keyof typeof UserType];
  await prisma.user.create({
    data: {
      username: _user.username,
      firstname: _user.firstname,
      lastname: _user.lastname,
      avatar: _user.avatar,
      email: _user.email,
      password: _user.passwordless
        ? _user.password
        : await encrypt(_user.password),
      passwordless: _user.passwordless,
      blocked: _user.blocked,
      managed: _user.managed,
      type: usertype,
      address: {
        create: {
          country: {
            connect: {
              name: _user.country,
            },
          },
        },
      },
      policies: {
        connect: _user.policies.map((_policy: string) => {
          return {
            name: _policy,
          };
        }),
      },
      roles: {
        connect: _user.roles.map((_role: string) => {
          return {
            name: _role,
          };
        }),
      },
    },
  });
};

const createUsers = async (users: UserForExport[]): Promise<void> => {
  for (let i = 0; i < users.length; i++) {
    await createUser(users[i]);
  }
};

const createGroup = async (_group: GroupForExport): Promise<void> => {
  await prisma.group.create({
    data: {
      name: _group.name,
      description: _group.description,
      managed: _group.managed,
      policies: {
        connect: _group.policies.map((_policy: string) => {
          return {
            name: _policy,
          };
        }),
      },
      roles: {
        connect: _group.roles.map((_role: string) => {
          return {
            name: _role,
          };
        }),
      },
      users: {
        connect: _group.users.map((_user: UserForGroupForExport) => {
          return {
            firstname_lastname: {
              firstname: _user.firstname,
              lastname: _user.lastname,
            },
          };
        }),
      },
    },
  });
};

const createGroups = async (groups: GroupForExport[]): Promise<void> => {
  for (let i = 0; i < groups.length; i++) {
    await createGroup(groups[i]);
  }
};

export const importIamData = async (_data: IamData): Promise<void> => {
  await cleanDbTables([
    "servicestatements",
    "policies",
    "roles",
    "users",
    "groups",
  ]).then(async () => {
    await createServiceStatements(_data.servicestatements).then(async () => {
      await createPolicies(_data.policies).then(async () => {
        await createRoles(_data.roles).then(async () => {
          await createUsers(_data.users).then(async () => {
            await createGroups(_data.groups);
          });
        });
      });
    });
  });
};
