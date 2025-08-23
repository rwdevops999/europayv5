"use client";

import { useHistorySettings } from "@/hooks/use-history-settings";
import { useEffect, useState } from "react";
import { uploadTemplates } from "../server/templates";
import { createHistoryEntry } from "../server/history";
import { HistoryType } from "@/generated/prisma";

const SetupTemplates = ({
  proceed,
}: {
  proceed: (_value: boolean) => void;
}) => {
  const { getHistory } = useHistorySettings();

  const [templatesLoaded, setTemplatesLoaded] = useState<boolean>(false);

  const setup = async (): Promise<void> => {
    console.log("[Initialise]", "SetupTemplates", "Uploading templates");
    await uploadTemplates(process.env.NEXT_PUBLIC_TEMPLATE_FILE, true).then(
      async () => {
        setTemplatesLoaded(true);

        await createHistoryEntry(
          HistoryType.INFO,
          getHistory(),
          "INITIALISATION",
          { subject: "TEMPLATES" },
          "Initialise:SetupTemplates"
        );

        console.log("[Initialise]", "SetupTemplates", "TEMPLATES LOADED");
        proceed(true);
      }
    );
  };

  useEffect(() => {
    if (!templatesLoaded) {
      console.log("[Initialise]", "SetupTemplates", "Load Templates?");
      setup();
    } else {
      proceed(true);
    }
  }, []);

  return null;
};

export default SetupTemplates;
