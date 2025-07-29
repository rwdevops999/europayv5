"use server";
import prisma from "@/lib/prisma";
import {
  cWhatToSelectFromServiceStatement,
  tServiceStatement,
  tServiceStatementCreate,
  tServiceStatementUpdate,
} from "@/lib/prisma-types";

export const loadServiceStatements = async (): Promise<tServiceStatement[]> => {
  let result: tServiceStatement[] = [];

  await prisma.serviceStatement
    .findMany({
      ...cWhatToSelectFromServiceStatement,
    })
    .then((values: tServiceStatement[]) => (result = values));

  return result;
};

export const deleteServiceStatement = async (_id: number): Promise<void> => {
  await prisma.serviceStatement.delete({
    where: {
      id: _id,
    },
  });
};

export const createServiceStatement = async (
  _statement: tServiceStatementCreate
): Promise<string | undefined> => {
  let errorcode: string | undefined = undefined;
  await prisma.serviceStatement
    .create({
      data: _statement,
    })
    .catch((error: any) => (errorcode = error.code));

  return errorcode;
};

export const updateServiceStatement = async (
  _statement: tServiceStatementUpdate
): Promise<string | undefined> => {
  let errorcode: string | undefined = undefined;
  await prisma.serviceStatement
    .update({
      where: {
        id: _statement.id as number,
      },
      data: _statement,
    })
    .catch((error: any) => {
      errorcode = error.code;
    });

  return errorcode;
};
