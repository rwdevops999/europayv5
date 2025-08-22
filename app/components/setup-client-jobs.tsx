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
    console.log("Create History", _message);
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
        console.log(
          "[SetupClientJobs]",
          "Job Created => continue with innjest"
        );

        console.log("[SetupClientJobs]", "Start TaskPoller", job.id);
        await runInngestJobForTaskPoller(job.id).then(async () => {
          console.log("[SetupClientJobs]", "Inngest Job Started");
          setJobsInitialised(true);
          await createHistoryForJobs("CLIENT JOBS").then(() => proceed(true));
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

      if (start) {
        console.log("[SetupClientJobs]", "Register listener");
        registerListener(socket, taskKey, taskListenerFunction);
        console.log("[SetupClientJobs]", "Create Job");
        startupJob();
      }
    }
  }, [socket, start]);

  return null;
};

export default SetupClientJobs;
