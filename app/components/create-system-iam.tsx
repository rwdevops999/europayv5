"use client";

import { useHistorySettings } from "@/hooks/use-history-settings";
import { useEffect, useState } from "react";
import {
  managedGroupInfo,
  managedgroups,
} from "../server/setup/services-and-actions";
import { createGroup } from "../server/groups";
import { tGroupCreate } from "@/lib/prisma-types";
import { createHistoryEntry } from "../server/history";
import { HistoryType } from "@/generated/prisma";
import { provisionSystemIAM } from "../server/managed";
import { countSystemServiceStatements } from "../server/service-statements";

const CreateSystemIam = ({
  start,
  proceed,
}: {
  start: boolean;
  proceed: (value: boolean) => void;
}) => {
  const { getHistory } = useHistorySettings();

  const uploadManagedEntitiesNeeded = async (): Promise<boolean> => {
    let result: boolean = true;

    const systemServices: number = await countSystemServiceStatements();

    result = systemServices === 0;

    return result;
  };

  const setup = async (): Promise<void> => {
    let uploaded: boolean = false;

    let message: string = "";

    if (await uploadManagedEntitiesNeeded()) {
      uploaded = await provisionSystemIAM();

      if (!uploaded) {
        message = "SYSTEM ENTITIES NOT";
      }
    } else {
      message = "SYSTEM ENTITIES NOT";
    }

    if (uploaded) {
      message = "SYSTEM ENTITIES";
    } else {
      message = "SYSTEM ENTITIES NOT";
    }

    await createHistoryEntry(
      HistoryType.INFO,
      getHistory(),
      "INITIALISATION",
      { subject: `${message}` },
      "Initialise:SetupSystemIam"
    ).then(() => {
      proceed(true);
    });

    console.log("UPLOADED SYSTEM ENTITIES", uploaded);
  };

  useEffect(() => {
    if (start) {
      setup();
    }
  }, [start]);

  return null;
};

export default CreateSystemIam;
