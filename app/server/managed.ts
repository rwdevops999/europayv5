"use server";

import { resetTables } from "./app-tables";
import { defineSystemGroups } from "./groups";
import { defineSystemPolicies } from "./policies";
import { defineSystemRoles } from "./roles";
import { defineSystemServiceStatements } from "./service-statements";
import { defineSystemUsers } from "./users";

export const provisionSystemIAM = async (
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
    await defineSystemServiceStatements().then(async () => {
      await defineSystemPolicies().then(async () => {
        await defineSystemRoles().then(async () => {
          await defineSystemUsers().then(async () => {
            await defineSystemGroups().then(() => (result = true));
          });
        });
      });
    });
  });

  return result;
};
