"use client";

import { useHistorySettings } from "@/hooks/use-history-settings";
import { useEffect, useState } from "react";
import {
  getDBTemplatesCount,
  getFileTemplatesCount,
  uploadTemplates,
} from "../server/templates";
import { createHistoryEntry } from "../server/history";
import { HistoryType } from "@/generated/prisma";

const SetupTemplates = ({
  proceed,
}: {
  proceed: (_value: boolean) => void;
}) => {
  const { getHistory } = useHistorySettings();

  const uploadTemplatesNeeded = async (): Promise<boolean> => {
    let result: boolean = false;

    const dbTemplates: number = await getDBTemplatesCount();

    const fileTemplates: number = await getFileTemplatesCount(
      process.env.NEXT_PUBLIC_TEMPLATE_FILE
    );

    result = dbTemplates === 0 || dbTemplates < fileTemplates;

    return result;
  };

  const setup = async (): Promise<void> => {
    if (await uploadTemplatesNeeded()) {
      await uploadTemplates(process.env.NEXT_PUBLIC_TEMPLATE_FILE, true).then(
        async () => {
          await createHistoryEntry(
            HistoryType.INFO,
            getHistory(),
            "INITIALISATION",
            { subject: "TEMPLATES" },
            "Initialise:SetupTemplates"
          );
        }
      );
    }

    proceed(true);
  };

  useEffect(() => {
    setup();
  }, []);

  return null;
};

export default SetupTemplates;
