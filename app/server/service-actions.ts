"use server";

import { Prisma } from "@/generated/prisma";

/**
 * destructures the service actions to an array containing {serviceactionname: serviceaction}
 *
 * @param _services the record containing the service and its actions
 *
 * @returns an array of items used to create service actions with prisma
 *
 * example: ["Email", ["Create", "Delete"]] => [{serviceactionname: Create}, {serviceactionname: Delete}]
 */
export const desctructureServiceActions = async (
  _services: Record<string, string[]>
): Promise<Prisma.ServiceActionCreateManyInput[]> => {
  let entries: Prisma.ServiceActionCreateManyInput[] = Object.entries(
    _services
  ).reduce<Prisma.ServiceActionCreateManyInput[]>(
    (acc: Prisma.ServiceActionCreateManyInput[], value) => {
      const serviceactions: string[] = value[1];

      serviceactions.forEach((serviceaction: string) => {
        if (
          !acc.some(
            (value: Prisma.ServiceActionCreateManyInput) =>
              value.serviceactionname === serviceaction
          )
        ) {
          const item: Prisma.ServiceActionCreateManyInput = {
            serviceactionname: serviceaction,
          };

          acc.push(item);
        }
      });

      return acc;
    },
    []
  );

  return entries;
};
