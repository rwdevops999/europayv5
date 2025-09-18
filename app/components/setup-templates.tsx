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

  const createHistoryForTemplates = async (_message: string): Promise<void> => {
    await createHistoryEntry(
      HistoryType.INFO,
      getHistory(),
      "INITIALISATION",
      { subject: `${_message}` },
      "Initialise:SetupTemplates"
    );
  };

  const uploadTemplatesNeeded = async (): Promise<boolean> => {
    let result: boolean = false;

    const dbTemplates: number = await getDBTemplatesCount();

    console.log("UPLOAD TEMPLATES:", process.env.NEXT_PUBLIC_TEMPLATE_FILE);
    const fileTemplates: number = await getFileTemplatesCount(
      process.env.NEXT_PUBLIC_TEMPLATE_FILE
    );

    result = dbTemplates === 0 || dbTemplates < fileTemplates;

    console.log(
      "[TEMPLATES] upload needed",
      result,
      "DB",
      dbTemplates,
      "file",
      fileTemplates
    );

    return result;
  };

  const setup = async (): Promise<void> => {
    let message: string = "";

    if (await uploadTemplatesNeeded()) {
      await uploadTemplates(process.env.NEXT_PUBLIC_TEMPLATE_FILE, true).then(
        () => (message = "TEMPLATES")
      );
    } else {
      message = "TEMPLATES NOT";
    }

    await createHistoryForTemplates(message).then(() => proceed(true));
  };

  useEffect(() => {
    setup();
  }, []);

  return null;
};

export default SetupTemplates;
