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

  console.log("PROVISIONING SYSTEM IAM");

  console.log("RESET TABLES");
  await resetTables([
    "ServiceStatement",
    "Policy",
    "Role",
    "User",
    "Group",
  ]).then(async () => {
    console.log("LOAD SERVICE STATEMENTS");
    await defineSystemServiceStatements().then(async () => {
      console.log("LOAD POLICIES");
      await defineSystemPolicies().then(async () => {
        console.log("LOAD ROLES");
        await defineSystemRoles().then(async () => {
          console.log("LOAD USERS");
          await defineSystemUsers().then(async () => {
            console.log("LOAD GROUPS");
            await defineSystemGroups().then(() => (result = true));
          });
        });
      });
    });
  });

  console.log("PROVISIONING SYSTEM IAM DONE", result);

  return result;
};
