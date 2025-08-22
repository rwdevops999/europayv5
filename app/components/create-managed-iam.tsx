"use client";

import { useHistorySettings } from "@/hooks/use-history-settings";
import { useEffect, useState } from "react";

const CreateManagedIam = ({ start }: { start: boolean }) => {
  const { getHistory } = useHistorySettings();

  const [iamInitialised, setIamInitialised] = useState<boolean>(false);

  useEffect(() => {
    if (start) {
      console.log("Creating Managed IAM entities");
    }
  }, [start]);

  return null;
};

export default CreateManagedIam;
