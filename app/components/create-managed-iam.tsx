"use client";

import { useHistorySettings } from "@/hooks/use-history-settings";
import { useEffect, useState } from "react";
import {
  managedGroupInfo,
  managedgroups,
} from "../server/setup/services-and-actions";
import { createGroup } from "../server/groups";
import { tGroupCreate } from "@/lib/prisma-types";
import { provisionManagedIAM } from "../server/managed";
import { createHistoryEntry } from "../server/history";
import { HistoryType } from "@/generated/prisma";

const CreateManagedIam = ({
  start,
  proceed,
}: {
  start: boolean;
  proceed: (value: boolean) => void;
}) => {
  const { getHistory } = useHistorySettings();

  const uploadManagedEntitiesNeeded = async (): Promise<boolean> => {
    let result: boolean = true;

    return result;
  };

  const setup = async (): Promise<void> => {
    let message: string = "MANAGED ENTITIES";

    if (await uploadManagedEntitiesNeeded()) {
      const uploaded: boolean = await provisionManagedIAM();

      if (!uploaded) {
        let message: string = "MANAGED ENTITIES NOT";
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
    }
  };

  useEffect(() => {
    if (start) {
      setup();
    }
  }, [start]);

  return null;
};

export default CreateManagedIam;
