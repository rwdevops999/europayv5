"use client";

import { useHistorySettings } from "@/hooks/use-history-settings";
import { useEffect, useState } from "react";
import { countCountries, defineCountries } from "../server/country";
import { createHistoryEntry } from "../server/history";
import { HistoryType } from "@/generated/prisma";

const SetupCountries = ({
  start,
  proceed,
}: {
  start: boolean;
  proceed: (value: boolean) => void;
}) => {
  const { getHistory } = useHistorySettings();

  const [countriesLoaded, setCountriesLoaded] = useState<boolean>(false);

  const createHistoryForCountries = async (_message: string): Promise<void> => {
    await createHistoryEntry(
      HistoryType.INFO,
      getHistory(),
      "INITIALISATION",
      { subject: `${_message}` },
      "Initialise:SetupServices"
    );
  };

  const setup = async (): Promise<void> => {
    await defineCountries(true).then(async () => {
      await createHistoryForCountries("COUNTRIES").then(() => {
        setCountriesLoaded(true);
        proceed(true);
      });
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
