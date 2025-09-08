"use client";

import { useHistorySettings } from "@/hooks/use-history-settings";
import { useEffect, useState } from "react";
import { countCountries, defineCountries } from "../server/country";
import { createHistoryEntry } from "../server/history";
import { HistoryType } from "@/generated/prisma";
import { getFileTemplatesCount } from "../server/templates";

const SetupCountries = ({
  start,
  proceed,
}: {
  start: boolean;
  proceed: (value: boolean) => void;
}) => {
  const { getHistory } = useHistorySettings();

  const uploadCountriesNeeded = async (): Promise<boolean> => {
    let result: boolean = false;

    const dbCountries: number = await countCountries();

    let countriesFile: string | undefined =
      process.env.NEXT_PUBLIC_COUNTRY_FILE;

    const fileCountries: number = await getFileTemplatesCount(countriesFile);

    result =
      (dbCountries === 0 && fileCountries > 0) || dbCountries < fileCountries;

    return result;
  };

  const setup = async (): Promise<void> => {
    let message: string = "COUNTRIES";

    if (await uploadCountriesNeeded()) {
      await defineCountries(true);
    } else {
      message = "COUNTRIES NOT";
    }

    await createHistoryEntry(
      HistoryType.INFO,
      getHistory(),
      "INITIALISATION",
      { subject: `${message}` },
      "Initialise:SetupCountries"
    ).then(() => {
      proceed(true);
    });
  };

  useEffect(() => {
    if (start) {
      setup();
    }
  }, [start]);

  return null;
};

export default SetupCountries;
