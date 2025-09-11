"use client";

import { useHistorySettings } from "@/hooks/use-history-settings";
import { useEffect, useState } from "react";
import { createHistoryEntry } from "../server/history";
import { HistoryType, JobModel, JobStatus } from "@/generated/prisma";
import { useSocket } from "@/hooks/use-socket";
import { useJob } from "@/hooks/use-job";
import { useTask } from "@/hooks/use-task";
import { tJob } from "@/lib/prisma-types";
import { taskKey, TaskPollerJobName } from "@/lib/constants";
import {
  createJob,
  deleteJob,
  findJobByName,
  runInngestJob,
  suspendInngestJob,
} from "../server/job";
import { registerListener } from "@/listeners/register-listener";
import { createDelayExpression } from "../client/cron";

const SetupClientJobs = ({
  start,
  proceed,
}: {
  start: boolean;
  proceed: (value: boolean) => void;
}) => {
  const { socket } = useSocket();
  const { getJobTimingNotation, jobsChanged, incrementJobsChanged } = useJob();
  const { getHistory } = useHistorySettings();
  const { setTaskAvailable } = useTask();

  const createHistoryForJobs = async (_message: string): Promise<void> => {
    await createHistoryEntry(
      HistoryType.INFO,
      getHistory(),
      "INITIALISATION",
      { subject: `${_message}` },
      "Initialise:SetupServices"
    );
  };

  const createClientJob = async (
    _jobname: string,
    _data: any
  ): Promise<tJob | null> => {
    const job: tJob | null = await createJob(
      _jobname,
      JobModel.CLIENT,
      _data,
      JobStatus.CREATED
    );

    return job;
  };

  const startupJob = async (): Promise<void> => {
    const job: tJob | null = await findJobByName(TaskPollerJobName);

    if (job) {
      if (job.status === JobStatus.RUNNING) {
        await suspendInngestJob(TaskPollerJobName, {
          jobid: job.id,
          delayexpression: "",
        });
      }

      await deleteJob(job.id);
    }

    const delay = createDelayExpression(
      getJobTimingNotation(TaskPollerJobName)
    );

    await createClientJob(TaskPollerJobName, { delayexpression: delay }).then(
      async (job: tJob | null) => {
        if (job) {
          await runInngestJob(TaskPollerJobName, {
            jobid: job.id,
            delayexpression: delay,
          }).then(() => incrementJobsChanged());
        }
      }
    );
  };

  const taskListenerFunction = async (data: any): Promise<void> => {
    const { key, value } = data;

    if (key === taskKey) {
      if (value > 0) {
        setTaskAvailable(value > 0);
      }
      incrementJobsChanged();
    }
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
