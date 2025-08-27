"use client";

import React, { useEffect, useRef, useState } from "react";
import Loaded from "./loaded";
import { useSocket } from "@/hooks/use-socket";
import { registerListener } from "@/listeners/register-listener";
import {
  changeJobStatus,
  createJob,
  deleteJob,
  findJobByName,
  runInngestJob,
} from "@/app/server/job";
import { JobModel, JobStatus } from "@/generated/prisma";
import { tJob } from "@/lib/prisma-types";
import { json } from "@/lib/util";
import { useJob } from "@/hooks/use-job";
import { taskKey, TaskPollerJobName } from "@/lib/constants";
import { useTask } from "@/hooks/use-task";

const SetupClientJobs = () => {
  const { socket, isConnected } = useSocket();
  const { getJobTiming } = useJob();
  const { setTaskAvailable } = useTask();

  const [isInitialised, setIsIntialised] = useState<boolean>(false);

  const startupJob = async (): Promise<void> => {
    await createTaskPollerJob().then(async (job: tJob | null) => {
      if (job) {
        await runInngestJobForTaskPoller(job.id).then(() => {
          setIsIntialised(true);
        });
      }
    });
  };

  const taskListenerFunction = async (data: any): Promise<void> => {
    const { key, value } = data;

    if (key === taskKey) {
      await findJobByName(TaskPollerJobName).then(async (job: tJob | null) => {
        if (job && job.status === JobStatus.RUNNING) {
          setTaskAvailable(value > 0);
          await deleteJob(job.id).then(() => {
            startupJob();
          });
        }
      });
    }
  };

  const createTaskPollerJob = async (): Promise<tJob | null> => {
    const job: tJob | null = await createJob(
      TaskPollerJobName,
      JobModel.CLIENT,
      {},
      JobStatus.RUNNING
    );

    return job;
  };

  const runInngestJobForTaskPoller = async (jobId: number): Promise<void> => {
    await runInngestJob(
      TaskPollerJobName,
      getJobTiming(TaskPollerJobName),
      jobId
    );
  };

  useEffect(() => {
    if (socket) {
      registerListener(socket, taskKey, taskListenerFunction);
      startupJob();
    }
  }, [socket]);

  return null;
};

export default SetupClientJobs;
