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
    console.log("[SetupSettings]", "in DB are", dbSettings);

    const memSettings: number = appsettings.length;
    console.log("[SetupSettings]", "in mem are", memSettings);

    result = (dbSettings === 0 && memSettings > 0) || dbSettings < memSettings;
    console.log("[SetupSettings]", "upload needed", result);

    return result;
  };

  const setup = async (): Promise<void> => {
    let message: string = "SETTINGS";

    if (await uploadSettingsNeeded()) {
      console.log("[SetupSettings]", "Upload Settings");
      await createSettings(appsettings);
    } else {
      console.log("[SetupSettings]", "Do NOT Upload Settings");
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
      console.log("Setup Settings");
      setup();
    }
  }, [start]);

  return null;
};

export default SetupSettings;
