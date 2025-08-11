"use server";

import {
  cWhatToSelectFromRole,
  tRole,
  tRoleCreate,
  tRoleUpdate,
} from "@/lib/prisma-types";
import prisma from "@/lib/prisma";
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
      ...cWhatToSelectFromRole,
    })
    .then((values: tRole[]) => (result = values));

  return result;
};
