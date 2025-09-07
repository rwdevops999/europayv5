"use client";

import { useHistorySettings } from "@/hooks/use-history-settings";
import { useEffect, useState } from "react";
import { createHistoryEntry } from "../server/history";
import { HistoryType, JobModel, JobStatus } from "@/generated/prisma";
import { clearRunningJobs } from "../server/job";
import { tJob } from "@/lib/prisma-types";
import { TaskPollerJobName, TransactionPollerJobName } from "@/lib/constants";

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
    await createHistoryEntry(
      HistoryType.INFO,
      getHistory(),
      "INITIALISATION",
      { subject: `${_message}` },
      "Initialise:SetupServices"
    );
  };

  const handleJobsOf = async (_type: string): Promise<void> => {};

  const setup = async (): Promise<void> => {
    handleJobsOf(TaskPollerJobName);
    handleJobsOf(TransactionPollerJobName);

    // const jobs: tJob = await findJobs(JobModel.CLIENT, [JobStatus.CREATED, JobStatus.SUSPENDED, JobStatus.COMPLETED]);

    // setJobsDeleted(deletedJobs);
    // if (deletedJobs) {
    //   await createHistoryForJobs("DELETION CLIENT JOBS").then(() => {
    //     proceed(true);
    //   });
    // } else {
    //   createHistoryForJobs("DELETION CLIENT JOBS NOT");
    //   proceed(true);
    // }
  };

  useEffect(() => {
    if (start) {
      console.log("DELETE CLIENT JOBS");
      setup();
    }
  }, [start]);

  return null;
};

export default DeleteClientJobs;
