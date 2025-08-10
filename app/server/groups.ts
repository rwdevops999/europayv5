"use server";

import {
  cWhatToSelectFromGroup,
  tGroup,
  tGroupCreate,
  tGroupUpdate,
} from "@/lib/prisma-types";
import prisma from "@/lib/prisma";

export const createGroup = async (
  _group: tGroupCreate
): Promise<string | undefined> => {
  let errorcode: string | undefined = undefined;

  await prisma.group
    .create({
      data: _group,
    })
    .catch((error: any) => (errorcode = error.code));

  return errorcode;
};

export const updateGroup = async (
  _group: tGroupUpdate
): Promise<string | undefined> => {
  let errorcode: string | undefined = undefined;

  await prisma.group
    .update({
      where: {
        id: _group.id as number,
      },
      data: _group,
    })
    .catch((error: any) => (errorcode = error.code));

  return errorcode;
};

export const deleteGroup = async (_id: number): Promise<void> => {
  await prisma.group.delete({
    where: {
      id: _id,
    },
  });
};

export const loadGroups = async (): Promise<tGroup[]> => {
  let result: tGroup[] = [];

  await prisma.group
    .findMany({
      ...cWhatToSelectFromGroup,
    })
    .then((values: tGroup[]) => (result = values));

  return result;
};
