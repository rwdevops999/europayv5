import React, { Suspense } from "react";
import Loaded from "./loaded";
import { createSettings } from "@/app/server/settings";
import { appsettings } from "@/app/server/data/setting-data";
import LoadingSpinner from "@/ui/loading-spinner";
import ProcessSettings from "./process-settings";
import { clearRunningJobs } from "@/app/server/job";
import { processOtpsOnServer } from "@/app/server/otp";
import { JobModel } from "@/generated/prisma";

const JobCreator = async () => {
  await clearRunningJobs(JobModel.SERVER).then(async () => {
    await processOtpsOnServer();
  });

  return null;
};

const SetupServerJobsWithSuspense = async ({
  _needprocessing,
}: {
  _needprocessing: boolean;
}) => {
  if (!_needprocessing) {
    return null;
  }

  return (
    <Suspense fallback={<LoadingSpinner label="Processing..." />}>
      <JobCreator />
    </Suspense>
  );
};

export default SetupServerJobsWithSuspense;
