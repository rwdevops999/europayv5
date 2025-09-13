"use client";

import { useHistorySettings } from "@/hooks/use-history-settings";
import { useEffect } from "react";
import { createHistoryEntry } from "../server/history";
import { HistoryType, JobModel } from "@/generated/prisma";
import { clearRunningJobs, deletRunningJobsOfType } from "../server/job";
import { countOngoingOTPs, processOtpsOnServer } from "../server/otp";

const SetupServerJobs = ({
  start,
  proceed,
}: {
  start: boolean;
  proceed: (value: boolean) => void;
}) => {
  const { getHistory } = useHistorySettings();

  const createHistoryForJobs = async (_message: string): Promise<void> => {
    await createHistoryEntry(
      HistoryType.INFO,
      getHistory(),
      "INITIALISATION",
      { subject: `${_message}` },
      "Initialise:SetupServerJobs"
    );
  };

  const setup = async (): Promise<void> => {
    const nrOngoingOtps: number = await countOngoingOTPs();
    const needProcessingOtps: boolean = nrOngoingOtps > 0;

    if (needProcessingOtps) {
      await clearRunningJobs(JobModel.SERVER, false).then(async () => {
        await processOtpsOnServer().then(async () => {
          await createHistoryForJobs("OTP JOBS").then(() => {
            proceed(true);
          });
        });
      });
    } else {
      await deletRunningJobsOfType(JobModel.SERVER).then(async () => {
        await createHistoryForJobs("OTP JOBS NOT").then(() => {
          proceed(true);
        });
      });
    }
  };

  useEffect(() => {
    if (start) {
      setup();
    }
  }, [start]);

  return null;
};

export default SetupServerJobs;
