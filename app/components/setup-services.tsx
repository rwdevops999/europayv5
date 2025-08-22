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

  const [servicesLoaded, setServicesLoaded] = useState<boolean>(false);

  const setup = async (): Promise<void> => {
    const nrOfServices: number = await countServices();

    console.log("[Initialise]", "nrOfServices", nrOfServices);
    console.log(
      "[Initialise]",
      "defined Services",
      Object.keys(servicesandactions).length
    );

    if (
      (nrOfServices === 0 && Object.keys(servicesandactions).length > 0) ||
      nrOfServices < Object.keys(servicesandactions).length
    ) {
      console.log("[Initialise]", "SetupServices", "Loaded Services");
      await defineServices(servicesandactions, true).then(async () => {
        await createHistoryEntry(
          HistoryType.INFO,
          getHistory(),
          "INITIALISATION",
          { subject: "SERVICES" },
          "Initialise:SetupServices"
        ).then(() => {
          console.log("[Initialise]", "SetupServices", "SERVICES LOADED");

          setServicesLoaded(true);
          proceed(true);
        });
      });
    } else {
      await createHistoryEntry(
        HistoryType.INFO,
        getHistory(),
        "INITIALISATION",
        { subject: "SERVICES NOT" },
        "Initialise:SetupServices"
      ).then(() => {
        proceed(true);
      });
    }
  };

  useEffect(() => {
    if (start) {
      console.log("[Initialise]", "SetupServices", "Load Services?");
      setup();
    }
  }, [start]);

  return null;
};

export default SetupServices;
