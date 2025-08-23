"use client";

import { useHistorySettings } from "@/hooks/use-history-settings";
import { useEffect, useState } from "react";
import { createHistoryEntry } from "../server/history";
import { HistoryType, JobModel } from "@/generated/prisma";
import { clearRunningJobs } from "../server/job";
import { countOngoingOTPs, processOtpsOnServer } from "../server/otp";
import { cleanDbTables } from "../server/app-tables";

const SetupServerJobs = ({
  start,
  proceed,
}: {
  start: boolean;
  proceed: (value: boolean) => void;
}) => {
  const { getHistory } = useHistorySettings();

  const [jobsInitialised, setJobsInitialised] = useState<boolean>(false);

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
    const nrOngoingOtps: number = await countOngoingOTPs();
    const needProcessingOtps: boolean = nrOngoingOtps > 0;

    if (needProcessingOtps) {
      await clearRunningJobs(JobModel.SERVER, true).then(async () => {
        await processOtpsOnServer().then(async () => {
          setJobsInitialised(true);
          await createHistoryForJobs("OTP JOBS").then(() => {
            proceed(true);
          });
        });
      });
    } else {
      await cleanDbTables(["jobs"]).then(async () => {
        await createHistoryForJobs("OTP JOBS NOT").then(() => {
          proceed(true);
        });
      });
    }
  };

  useEffect(() => {
    if (start) {
      console.log("[Initialise]", "SetupServerJobs", "Create Server Jobs?");
      setup();
    }
  }, [start]);

  return null;
};

export default SetupServerJobs;
