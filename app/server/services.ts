"use server";
import prisma from "@/lib/prisma";
import { cleanDbTables } from "./app-tables";
import { desctructureServiceActions } from "./service-actions";
import { Prisma } from "@/generated/prisma";
import { cWhatToSelectFromService, tService } from "@/lib/prisma-types";

// === DB functions =================================
export const getServiceIdByName = async (
  _servicename: string
): Promise<number> => {
  let result: number = -1;

  await prisma.service
    .findFirst({
      where: {
        servicename: _servicename,
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
    console.log("ERROR: YOU LOOKED UP AN UNKNOWN SERVICE", _servicename);
  }

  return result;
};

/**
 * Count the services in the DB
 *
 * @returns the nr of  services available
 */
export const countServices = async (): Promise<number> => {
  let result: number = 0;

  await prisma.service.count().then((value: number) => (result = value));

  return result;
};

export const loadServices = async (): Promise<tService[]> => {
  let result: tService[] = [];

  await prisma.service
    .findMany({
      orderBy: {
        servicename: "asc",
      },
      ...cWhatToSelectFromService,
    })
    .then((values: tService[]) => (result = values));

  return result;
};

// === Other functions =================================
/**
 * Creates the service in the DB and link the serviceactions to it.
 *
 * @param _service the service
 * @param _actions the actions to link
 */
const createServiceAndLinkActions = async (
  _service: string,
  _actions: string[]
) => {
  await prisma.service.create({
    data: {
      servicename: _service,
      serviceactions: {
        connect: _actions.map((value: string) => {
          return { serviceactionname: value };
        }),
      },
    },
  });
};

/**
 * create services and service actions in database
 *
 * @param _servicesAndActions the services with the corresponding service actions
 * @param _resetTables clear the tables completely first
 * @returns
 */
export const defineServices = async (
  _servicesAndActions: Record<string, string[]>,
  _resetTables: boolean = false
): Promise<boolean> => {
  let servicesLoaded: boolean = false;

  if (_resetTables) {
    await cleanDbTables(["services"]);
  }

  await desctructureServiceActions(_servicesAndActions).then(
    async (_serviceactions: Prisma.ServiceActionCreateManyInput[]) => {
      await prisma.serviceAction
        .createMany({
          data: _serviceactions,
        })
        .then(async () => {
          const _services: any[] = Object.keys(_servicesAndActions);
          for (let i = 0; i < _services.length; i++) {
            createServiceAndLinkActions(
              _services[i],
              _servicesAndActions[_services[i]]
            );
          }
          servicesLoaded = true;
        });
    }
  );

  return servicesLoaded;
};
