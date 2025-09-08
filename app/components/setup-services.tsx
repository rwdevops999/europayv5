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

    const memServices: number = Object.keys(servicesandactions).length;

    result = (dbServices === 0 && memServices > 0) || dbServices < memServices;

    return result;
  };

  const setup = async (): Promise<void> => {
    let message: string = "SERVICES";

    if (await uploadServicesNeeded()) {
      await defineServices(servicesandactions, true);
    } else {
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
      setup();
    }
  }, [start]);

  return null;
};

export default SetupServices;
