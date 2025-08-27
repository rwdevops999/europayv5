"use server";
import { Permission } from "@/generated/prisma";
import { capitalize, json } from "@/lib/util";
import prisma from "@/lib/prisma";
import {
  cWhatToSelectFromServiceStatement,
  tServiceStatement,
  tServiceStatementCreate,
  tServiceStatementUpdate,
} from "@/lib/prisma-types";
import { ServiceStatementInfo } from "./setup/services-and-actions";
import { getServiceIdByName } from "./services";
import { getServiceActionIdByName } from "./service-actions";

export const loadServiceStatements = async (): Promise<tServiceStatement[]> => {
  let result: tServiceStatement[] = [];

  await prisma.serviceStatement
    .findMany({
      orderBy: {
        updateDate: "desc",
      },
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

const defineServiceStatementsForPermission = async (
  _permission: string,
  _statements: Record<string, ServiceStatementInfo>
): Promise<void> => {
  for (let i = 0; i < Object.keys(_statements).length; i++) {
    const ssname: string =
      capitalize(_permission) + Object.keys(_statements)[i];
    const ssvalue: ServiceStatementInfo = Object.values(_statements)[i];

    const _serviceId: number = await getServiceIdByName(ssvalue.service);
    const _serviceAcionId: number = await getServiceActionIdByName(
      ssvalue.action
    );

    const _statement: tServiceStatementCreate = {
      ssname: ssname,
      managed: true,
      description: `${ssname} (MANAGED)`,
      permission: Permission[_permission as keyof typeof Permission],
      serviceid: _serviceId,
      servicestatementactions: {
        create: [
          {
            ssactionname: ssname,
            serviceactionid: _serviceAcionId,
          },
        ],
      },
    };

    await createServiceStatement(_statement);
  }
};

export const defineServiceStatements = async (): Promise<void> => {
  // for (let i = 0; i < Object.values(Permission).length; i++) {
  //   const permission = Object.values(Permission)[i];
  //   defineServiceStatementsForPermission(permission, servicestatements);
  // }
};
