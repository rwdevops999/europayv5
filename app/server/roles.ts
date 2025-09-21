"use server";

import {
  cWhatToSelectFromRole,
  tRole,
  tRoleCreate,
  tRoleUpdate,
} from "@/lib/prisma-types";
import prisma from "@/lib/prisma";
import { SystemRoles } from "./setup/managed-iam";
import { getPolicyIdByName } from "./policies";
import { json } from "@/lib/util";
/**
 * create a role
 * @param _role the role to create
 *
 * @returns errorcode or undefined
 */
export const createRole = async (
  _role: tRoleCreate
): Promise<string | undefined> => {
  let errorcode: string | undefined = undefined;
  await prisma.role
    .create({
      data: _role,
    })
    .catch((error: any) => (errorcode = error.code));

  return errorcode;
};

/**
 * Update a role
 *
 * @param _role the role values
 *
 * @returns errorcode or undefined
 */
export const updateRole = async (
  _role: tRoleUpdate
): Promise<string | undefined> => {
  let errorcode: string | undefined = undefined;
  await prisma.role
    .update({
      where: {
        id: _role.id as number,
      },
      data: _role,
    })
    .catch((error: any) => (errorcode = error.code));

  return errorcode;
};

/**
 * delete a role
 * @param _id the role id
 */
export const deleteRole = async (_id: number): Promise<void> => {
  await prisma.role.delete({
    where: {
      id: _id,
    },
  });
};

export const loadRoles = async (): Promise<tRole[]> => {
  let result: tRole[] = [];

  await prisma.role
    .findMany({
      orderBy: {
        createDate: "desc",
      },
      ...cWhatToSelectFromRole,
    })
    .then((values: tRole[]) => (result = values));

  return result;
};

export const defineSystemRoles = async (): Promise<void> => {
  // TRUNCATE Role

  const roleNames: string[] = Object.keys(SystemRoles);

  for (let roleName of roleNames) {
    const roleInfo: any = SystemRoles[roleName];

    const policies: string[] = roleInfo.policy;

    console.log("ROLE: ", roleName, "with POLICIES: ", json(policies));

    const policyids: any[] = [];
    for (let policyName of policies) {
      policyids.push({
        id: await getPolicyIdByName(policyName),
      });
    }

    const create: tRoleCreate = {
      name: roleName,
      description: roleInfo.description,
      managed: true,
      system: true,
      policies: {
        connect: policyids,
      },
    };

    await createRole(create);
  }
};

export const getRoleIdByName = async (_name: string): Promise<number> => {
  let result: number = -1;

  await prisma.role
    .findFirst({
      where: {
        name: _name,
      },
      select: {
        id: true,
      },
    })
    .then((value: any | null) => {
      if (value) {
        result = value.id;
      }
    });

  if (result === -1) {
    console.log("ERROR: YOU LOOKED UP AN UNKNOWN ROLE", _name);
  }

  return result;
};
