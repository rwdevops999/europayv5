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

  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);

  const createHistoryForSettings = async (_message: string): Promise<void> => {
    console.log("Create History", _message);
    await createHistoryEntry(
      HistoryType.INFO,
      getHistory(),
      "INITIALISATION",
      { subject: `${_message}` },
      "Initialise:SetupServices"
    );
  };

  const setup = async (): Promise<void> => {
    const nrOfSettings: number = await countSettings();

    const loadSettings: boolean = nrOfSettings < appsettings.length;
    if (loadSettings) {
      await createSettings(appsettings).then(async () => {
        setSettingsLoaded(true);
        await createHistoryForSettings("SETTINGS").then(() => {
          setSettingsLoaded(true);
          console.log("[Initialise]", "SetupSettings", "SETTINGS LOADED");
          proceed(true);
        });
      });
    } else {
      await createHistoryForSettings("SETTINGS NOT").then(() => proceed(true));
    }
  };

  useEffect(() => {
    if (start) {
      console.log("[Initialise]", "SetupSettings", "Load Settings?");
      setup();
    }
  }, [start]);

  return null;
};

export default SetupSettings;
