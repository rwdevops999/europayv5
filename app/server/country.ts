"use server";

import prisma from "@/lib/prisma";
import { cleanDbTables } from "./app-tables";
import { tCountryFile } from "@/lib/types";
import path from "path";
import * as fs from "fs";
import {
  cWhatToSelectFromCountry,
  tCountry,
  tCountryCreate,
} from "@/lib/prisma-types";
import { Prisma } from "@/generated/prisma";

// DATABASE
export const countCountries = async (): Promise<number> => {
  let result: number = 0;

  await prisma.country.count().then((value: number) => (result = value));

  return result;
};

const countCountriesFromFile = async (filename: string): Promise<number> => {
  const csvFilePath = path.resolve(filename);
  const fileContent = fs.readFileSync(csvFilePath);
  var decoder = new TextDecoder("utf-8");
  let str = decoder.decode(fileContent);

  let countries: tCountryFile[] = JSON.parse(str);

  return countries.length;
};

export const loadCountries = async (): Promise<tCountry[]> => {
  let result: tCountry[] = [];

  await prisma.country
    .findMany({
      ...cWhatToSelectFromCountry,
    })
    .then((values: tCountry[]) => (result = values));

  return result;
};

// FILE
const loadCountriesFromFile = async (
  filename: string
): Promise<tCountryFile[]> => {
  const csvFilePath = path.resolve(filename);
  const fileContent = fs.readFileSync(csvFilePath);
  var decoder = new TextDecoder("utf-8");
  let str = decoder.decode(fileContent);

  let countries: tCountryFile[] = JSON.parse(str);

  return countries;
};

const provisionCountries = async (
  _filename: string | undefined
): Promise<number> => {
  let countriesLoaded: number = 0;

  if (_filename) {
    const countries: tCountryFile[] = await loadCountriesFromFile(_filename);

    const dbCountries: tCountryCreate[] = countries.map(
      (_country: tCountryFile) => {
        let country: tCountryCreate;
        country = {
          name: _country.name,
          dialCode: _country.dial_code,
          code: _country.code,
          currency: _country.currency,
          currencycode: _country.currencycode,
          symbol: _country.symbol,
        };

        return country;
      }
    );

    await prisma.country
      .createMany({ data: dbCountries })
      .then((payload: Prisma.BatchPayload) => {
        countriesLoaded = payload.count;
      });
  }

  return countriesLoaded;
};

export const defineCountries = async (
  _resetTables: boolean = true,
  _cascade: boolean = false
): Promise<number> => {
  let count: number = 0;

  let countriesFile: string | undefined = process.env.NEXT_PUBLIC_COUNTRY_FILE;

  if (countriesFile) {
    if (_resetTables) {
      await cleanDbTables(["countries"], false, false);
    }

    await provisionCountries(countriesFile).then((value: number) => {
      count = value;
    });
  }

  return count;
};

export const loadCountryByName = async (
  _name: string
): Promise<tCountry | null> => {
  let result: tCountry | null = null;

  await prisma.country
    .findFirst({
      where: {
        name: _name,
      },
      ...cWhatToSelectFromCountry,
    })
    .then((value: tCountry | null) => (result = value));

  return result;
};
