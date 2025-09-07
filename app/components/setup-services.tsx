"use client";

import { useEffect, useState } from "react";
import { countServices, defineServices } from "../server/services";
import { servicesandactions } from "../server/setup/services-and-actions";
import Loaded from "../(europay)/components/initialise/loaded";
import { useHistorySettings } from "@/hooks/use-history-settings";
import { createHistoryEntry } from "../server/history";
import { HistoryType } from "@/generated/prisma";

const SetupServices = ({
  start,
  proceed,
}: {
  start: boolean;
  proceed: (value: boolean) => void;
}) => {
  const { getHistory } = useHistorySettings();

  const uploadServicesNeeded = async (): Promise<boolean> => {
    let result: boolean = false;

    const dbServices: number = await countServices();
    console.log("[SetupServices]", "in DB are", dbServices);

    const memServices: number = Object.keys(servicesandactions).length;
    console.log("[SetupServices]", "in mem are", memServices);

    result = (dbServices === 0 && memServices > 0) || dbServices < memServices;
    console.log("[SetupServices]", "upload needed", result);

    return result;
  };

  const setup = async (): Promise<void> => {
    let message: string = "SERVICES";

    if (await uploadServicesNeeded()) {
      console.log("[SetupServices]", "Upload Services");
      await defineServices(servicesandactions, true);
    } else {
      console.log("[SetupServices]", "Do NOT Upload Services");
      message = "SERVICES NOT";
    }

    await createHistoryEntry(
      HistoryType.INFO,
      getHistory(),
      "INITIALISATION",
      { subject: `${message}` },
      "Initialise:SetupServices"
    ).then(() => {
      proceed(true);
    });
  };

  useEffect(() => {
    if (start) {
      console.log("Setup Services");
      setup();
    }
  }, [start]);

  return null;
};

export default SetupServices;
