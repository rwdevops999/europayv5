"use server";

import { defineServiceStatements } from "./service-statements";

export const provisionManagedIAM = async (
  _resetTables: boolean = false
): Promise<boolean> => {
  let result: boolean = false;

  await defineServiceStatements().then(() => (result = true));

  return result;
};
