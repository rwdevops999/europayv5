"use client";

import { useHistorySettings } from "@/hooks/use-history-settings";
import { useEffect, useState } from "react";
import { countSettings, createSettings } from "../server/settings";
import { appsettings } from "../server/data/setting-data";
import { createHistoryEntry } from "../server/history";
import { HistoryType } from "@/generated/prisma";

const SetupSettings = ({
  start,
  proceed,
}: {
  start: boolean;
  proceed: (value: boolean) => void;
}) => {
  const { getHistory } = useHistorySettings();

  const uploadSettingsNeeded = async (): Promise<boolean> => {
    let result: boolean = false;

    const dbSettings: number = await countSettings();

    const memSettings: number = appsettings.length;

    result = (dbSettings === 0 && memSettings > 0) || dbSettings < memSettings;

    return result;
  };

  const setup = async (): Promise<void> => {
    let message: string = "SETTINGS";

    if (await uploadSettingsNeeded()) {
      await createSettings(appsettings);
    } else {
      message = "SETTINGS NOT";
    }

    await createHistoryEntry(
      HistoryType.INFO,
      getHistory(),
      "INITIALISATION",
      { subject: `${message}` },
      "Initialise:SetupSettings"
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

export default SetupSettings;
