"use server";
import { Permission } from "@/generated/prisma";
import { capitalize, json } from "@/lib/util";
import prisma from "@/lib/prisma";
import {
  cWhatToSelectFromServiceStatement,
  tService,
  tServiceAction,
  tServiceStatement,
  tServiceStatementActionCreate,
  tServiceStatementCreate,
  tServiceStatementUpdate,
} from "@/lib/prisma-types";
import { ServiceStatementInfo } from "./setup/services-and-actions";
import { getServiceIdByName } from "./services";
import { getServiceActionIdByName } from "./service-actions";
import { AllowedSystemServiceStatements } from "./setup/managed-iam";

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

export const getServiceStatementIdByName = async (
  _name: string
): Promise<number> => {
  let result: number = -1;

  await prisma.serviceStatement
    .findFirst({
      where: {
        ssname: _name,
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
    console.log("ERROR: YOU LOOKED UP AN UNKNOWN SERVICE STATEMENT", _name);
  }

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

export const createServiceStatementWithResult = async (
  _statement: tServiceStatementCreate
): Promise<tServiceStatement | null> => {
  let result: tServiceStatement | null = null;

  await prisma.serviceStatement
    .create({
      data: _statement,
      ...cWhatToSelectFromServiceStatement,
    })
    .then((value: tServiceStatement) => (result = value));

  return result;
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

export const createServiceStatementAction = async (
  _action: tServiceStatementActionCreate
): Promise<void> => {
  await prisma.serviceStatementAction.create({
    data: _action,
  });
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

const defineServiceStatementAction = async (
  _statementid: number,
  _name: string,
  _actions: string[]
): Promise<void> => {
  for (let action of _actions) {
    const _serviceactionid: number = await getServiceActionIdByName(action);

    const _action: tServiceStatementActionCreate = {
      ssactionname: _name,
      serviceactionid: _serviceactionid,
      statementid: _statementid,
    };

    await createServiceStatementAction(_action);
  }
};

const defineServiceStatement = async (
  _statementName: string,
  _statementInfo: any
): Promise<void> => {
  // Service Statement
  await getServiceIdByName(_statementInfo.service).then(
    async (_serviceId: number) => {
      const create: tServiceStatementCreate = {
        ssname: _statementName,
        description: _statementInfo.description,
        serviceid: _serviceId,
        managed: true,
        system: true,
      };

      const actions: string[] = _statementInfo.actions;

      await createServiceStatementWithResult(create).then(
        (statement: tServiceStatement | null) => {
          if (statement) {
            defineServiceStatementAction(statement.id, _statementName, actions);
          }
        }
      );
    }
  );
};

export const defineSystemServiceStatements = async (): Promise<void> => {
  const statementNames: string[] = Object.keys(AllowedSystemServiceStatements);

  for (let statementName of statementNames) {
    await defineServiceStatement(
      statementName,
      AllowedSystemServiceStatements[statementName]
    );
    // .then(async () => {
    //   await definePolicies();
    // });
  }
};

/**
 * Count the services in the DB
 *
 * @returns the nr of  services available
 */
export const countSystemServiceStatements = async (): Promise<number> => {
  let result: number = 0;

  await prisma.serviceStatement
    .count({
      where: {
        system: true,
      },
    })
    .then((value: number) => (result = value));

  return result;
};
