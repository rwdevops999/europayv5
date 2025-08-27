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

        proceed(true);
      }
    );
  };

  useEffect(() => {
    if (!templatesLoaded) {
      setup();
    } else {
      proceed(true);
    }
  }, []);

  return null;
};

export default SetupTemplates;
