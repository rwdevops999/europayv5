"use client";

import { useHistorySettings } from "@/hooks/use-history-settings";
import { useEffect, useState } from "react";
import { createHistoryEntry } from "../server/history";
import { HistoryType, JobModel, JobStatus } from "@/generated/prisma";
import { useSocket } from "@/hooks/use-socket";
import { useJob } from "@/hooks/use-job";
import { useTask } from "@/hooks/use-task";
import { tJob } from "@/lib/prisma-types";
import { json } from "@/lib/util";
import { taskKey, TaskPollerJobName } from "@/lib/constants";
import {
  createJob,
  deleteJob,
  findJobByName,
  runInngestJob,
} from "../server/job";
import { registerListener } from "@/listeners/register-listener";

const SetupClientJobs = ({
  start,
  proceed,
}: {
  start: boolean;
  proceed: (value: boolean) => void;
}) => {
  const { socket } = useSocket();
  const { getJobTiming } = useJob();
  const { setTaskAvailable } = useTask();
  const { getHistory } = useHistorySettings();

  const [jobsInitialised, setJobsInitialised] = useState<boolean>(false);

  const createHistoryForJobs = async (_message: string): Promise<void> => {
    await createHistoryEntry(
      HistoryType.INFO,
      getHistory(),
      "INITIALISATION",
      { subject: `${_message}` },
      "Initialise:SetupServices"
    );
  };

  const startupJob = async (): Promise<void> => {
    await createTaskPollerJob().then(async (job: tJob | null) => {
      if (job) {
        await runInngestJobForTaskPoller(job.id).then(async () => {
          setJobsInitialised(true);
          await createHistoryForJobs("CLIENT JOBS").then(() => proceed(true));
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
      if (start) {
        registerListener(socket, taskKey, taskListenerFunction);
        startupJob();
      }
    }
  }, [socket, start]);

  return null;
};

export default SetupClientJobs;
