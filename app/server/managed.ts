"use server";

import { resetTables } from "./app-tables";
import { defineManagedGroups } from "./groups";
import { defineManagedPolicies } from "./policies";
import { defineManagedRoles } from "./roles";
import { defineManagedServiceStatements } from "./service-statements";
import { defineManagedUsers } from "./users";

export const provisionManagedIAM = async (
  _resetTables: boolean = false
): Promise<boolean> => {
  let result: boolean = false;

  await resetTables([
    "ServiceStatement",
    "Policy",
    "Role",
    "User",
    "Group",
  ]).then(async () => {
    await defineManagedServiceStatements().then(async () => {
      await defineManagedPolicies().then(async () => {
        await defineManagedRoles().then(async () => {
          await defineManagedUsers().then(async () => {
            await defineManagedGroups().then(() => (result = true));
          });
        });
      });
    });
  });

  return result;
};
