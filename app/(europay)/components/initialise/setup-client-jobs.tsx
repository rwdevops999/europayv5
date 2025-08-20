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
        console.log(
          "[SetupClientJobs]",
          "Job Created => continue with innjest"
        );

        await runInngestJobForTaskPoller(job.id).then(() => {
          console.log("[SetupClientJobs]", "Inngest Job Started");
          setIsIntialised(true);
        });
      }
    });
  };

  const taskListenerFunction = async (data: any): Promise<void> => {
    console.log("RECEIVED DATA", json(data));
    const { key, value } = data;
    console.log("RECEIVED DATA ... key", key);
    console.log("RECEIVED DATA ... value", value);

    if (key === taskKey) {
      console.log("RECEIVED DATA for task processing");

      await findJobByName(TaskPollerJobName).then(async (job: tJob | null) => {
        if (job && job.status === JobStatus.RUNNING) {
          console.log("[taskPoller] ... job found and it is RUNNING", job.id);

          setTaskAvailable(value > 0);
          await deleteJob(job.id).then(() => {
            startupJob();
          });
        }
      });
    }
  };

  const createTaskPollerJob = async (): Promise<tJob | null> => {
    console.log("[SetupClientJobs]", "Creating DB Job (X)");

    const job: tJob | null = await createJob(
      TaskPollerJobName,
      JobModel.CLIENT,
      {},
      JobStatus.RUNNING
    );

    return job;
  };

  const runInngestJobForTaskPoller = async (jobId: number): Promise<void> => {
    console.log(
      "[SetupClientJobs]",
      "Run Inngest Job for",
      jobId,
      getJobTiming(TaskPollerJobName)
    );
    await runInngestJob(
      TaskPollerJobName,
      getJobTiming(TaskPollerJobName),
      jobId
    );
  };

  useEffect(() => {
    console.log("[SetupClientJobs]", "useEffect called on socket change");

    if (!socket) {
      console.log(
        "[SetupClientJobs]",
        "useEffect called on socket change ... not Connected"
      );
    } else {
      console.log(
        "[SetupClientJobs]",
        "useEffect called on socket change ... Connected to socket",
        socket
      );

      console.log("[SetupClientJobs]", "Register listener");
      registerListener(socket, taskKey, taskListenerFunction);
      console.log("[SetupClientJobs]", "Create Job");
      startupJob();
    }
  }, [socket]);

  return null;
};

export default SetupClientJobs;
