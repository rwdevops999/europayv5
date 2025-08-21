import React, { Suspense } from "react";
import Loaded from "./loaded";
import { createSettings } from "@/app/server/settings";
import { appsettings } from "@/app/server/data/setting-data";
import LoadingSpinner from "@/ui/loading-spinner";
import ProcessSettings from "./process-settings";
import { clearRunningJobs } from "@/app/server/job";
import { processOtpsOnServer } from "@/app/server/otp";
import { JobModel } from "@/generated/prisma";

const JobRemover = async () => {
  console.log("JobRemover for CLIENT Jobs");
  await clearRunningJobs(JobModel.CLIENT);

  return null;
};

const DeleteJobsWithSuspense = async ({
  _needremoval,
}: {
  _needremoval: boolean;
}) => {
  if (!_needremoval) {
    return null;
  }

  return (
    <Suspense fallback={<LoadingSpinner label="Processing..." />}>
      <JobRemover />
    </Suspense>
  );
};

export default DeleteJobsWithSuspense;
