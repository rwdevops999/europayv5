"use server";

import { cleanDbTables } from "./app-tables";
import { defineCountries } from "./country";
import { dbResult, dbTables } from "./data/db-tables";
import { defineServices } from "./services";
import { servicesandactions } from "./setup/services-and-actions";

export const clearDatabaseTables = async (
  provision: boolean
): Promise<dbResult> => {
  const result: dbResult = {
    nrOfservices: 0,
    nrOfcountries: 0,
  };

  await cleanDbTables(Object.keys(dbTables));

  if (provision) {
    if (await defineServices(servicesandactions)) {
      result.nrOfservices = Object.keys(servicesandactions).length;
    }

    result.nrOfcountries = await defineCountries();
  }

  return result;
};

export const loadServicesToDB = async (): Promise<number> => {
  if (await defineServices(servicesandactions)) {
    return Object.keys(servicesandactions).length;
  }

  return 0;
};

export const loadCountriesToDB = async (): Promise<number> => {
  return await defineCountries();
};
