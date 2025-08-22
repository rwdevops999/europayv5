"use client";

import { useHistorySettings } from "@/hooks/use-history-settings";
import { useEffect, useState } from "react";
import { createHistoryEntry } from "../server/history";
import { HistoryType, JobModel } from "@/generated/prisma";
import { clearRunningJobs } from "../server/job";

const DeleteClientJobs = ({
  start,
  proceed,
}: {
  start: boolean;
  proceed: (value: boolean) => void;
}) => {
  const { getHistory } = useHistorySettings();

  const [jobsDeleted, setJobsDeleted] = useState<boolean>(false);

  const createHistoryForJobs = async (_message: string): Promise<void> => {
    console.log("Create History", _message);
    await createHistoryEntry(
      HistoryType.INFO,
      getHistory(),
      "INITIALISATION",
      { subject: `${_message}` },
      "Initialise:SetupServices"
    );
  };

  const setup = async (): Promise<void> => {
    const deletedJobs: boolean = await clearRunningJobs(JobModel.CLIENT);

    setJobsDeleted(deletedJobs);
    if (deletedJobs) {
      await createHistoryForJobs("DELETION CLIENT JOBS").then(() => {
        console.log("[Initialise]", "DeleteClientJobs", "Deleted Client Jobs?");
        proceed(true);
      });
    } else {
      console.log(
        "[Initialise]",
        "DeleteClientJobs",
        "Not deleted any client Jobs?"
      );
      createHistoryForJobs("DELETION CLIENT JOBS NOT");
      proceed(true);
    }
  };

  useEffect(() => {
    if (start) {
      console.log("[Initialise]", "DeleteClientJobs", "Deleting Client Jobs?");
      setup();
    }
  }, [start]);

  return null;
};

export default DeleteClientJobs;
