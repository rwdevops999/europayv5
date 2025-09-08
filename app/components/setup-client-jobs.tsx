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
  const { getJobTimingNotation } = useJob();
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
    console.log("[startupJob]", "Starting Up job");

    const job: tJob | null = await findJobByName(TaskPollerJobName);

    if (job) {
      console.log("[startupJob]", "Job found");
      if (job.status === JobStatus.RUNNING) {
        console.log("[startupJob]", "Job is running => cancel inngest");
        await suspendInngestJob(TaskPollerJobName, {
          jobid: job.id,
          delayexpression: "",
        });
      }

      console.log("[startupJob]", "Delete job", job.id);
      await deleteJob(job.id);
    }

    const delay = createDelayExpression(
      getJobTimingNotation(TaskPollerJobName)
    );
    console.log("[startupJob]", "DELAY", delay);

    console.log("[startupJob]", "CREATE Client Job", delay);
    await createClientJob(TaskPollerJobName, { delayexpression: delay }).then(
      async (job: tJob | null) => {
        if (job) {
          console.log(
            "[startupJob]",
            "Client Job created => RUN INNGEST JOB",
            delay
          );
          await runInngestJob(TaskPollerJobName, {
            jobid: job.id,
            delayexpression: delay,
          });
        }
      }
    );
  };

  const taskListenerFunction = async (data: any): Promise<void> => {
    const { key, value } = data;
    console.log(
      "[taskListenerFunction]",
      "Received message for Inngest job",
      key,
      value
    );

    if (key === taskKey) {
      setTaskAvailable(value > 0);
    }
  };

  useEffect(() => {
    if (socket) {
      if (start) {
        console.log(
          "[SetupClientJob]:useEffect",
          "REGISTER Listener on TaskPoller"
        );
        registerListener(socket, taskKey, taskListenerFunction);
        console.log("[SetupClientJob]:useEffect", "Startup job");
        startupJob();
      }
    }
  }, [socket, start]);

  return null;
};

export default SetupClientJobs;
