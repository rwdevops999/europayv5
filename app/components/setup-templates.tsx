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
    console.log("[SetupTemplates]", "in DB are", dbTemplates);

    const fileTemplates: number = await getFileTemplatesCount(
      process.env.NEXT_PUBLIC_TEMPLATE_FILE
    );
    console.log("[SetupTemplates]", "in file are", fileTemplates);

    result = dbTemplates === 0 || dbTemplates < fileTemplates;
    console.log("[SetupTemplates]", "upload needed", result);

    return result;
  };

  const setup = async (): Promise<void> => {
    if (await uploadTemplatesNeeded()) {
      console.log("[SetupTemplates]", "uploading templates");
      await uploadTemplates(process.env.NEXT_PUBLIC_TEMPLATE_FILE, true).then(
        async () => {
          console.log("[SetupTemplates]", "templates uploaded");
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
    console.log("Setup Templates");
    setup();
  }, []);

  return null;
};

export default SetupTemplates;
