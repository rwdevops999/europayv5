import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { tJob } from "@/lib/prisma-types";
import {
  JobStatus,
  OTPStatus,
  TaskStatus,
  TransactionStatus,
} from "@/generated/prisma";
import { changeJobStatus, findJobByName, loadJobById } from "../server/job";
import { absoluteUrl } from "@/lib/util";
import { taskKey, TaskPollerJobName, transactionKey } from "@/lib/constants";
import { setOtpStatus } from "../server/otp";
import { countNonCompletedTasks } from "../server/tasks";
import { getNrOfTransactions } from "../server/transaction";

const createOTPJob = inngest.createFunction(
  {
    id: "create-otp-job",
    name: "Create OTP Job",
    cancelOn: [
      {
        event: "europay/otpjob.suspend",
        // ensure the async (future) event's userId matches the trigger userId
        match: "data.jobid",
      },
    ],
  },
  { event: "europay/otpjob.create" },
  async ({ event, step }) => {
    const { jobid } = event.data;

    const job: tJob | null = await loadJobById(jobid);

    if (job) {
      const data: any = job.data;

      const otpId: number = data.otpid;
      const now: Date = new Date(Date.now());
      const expirationdate: Date = new Date(data.expirationdate);

      const jobDuration = expirationdate.getTime() - now.getTime();

      const jobName = `OTP${otpId}`;

      await step.sleepUntil(
        `run ${jobName}`,
        new Date(now.getTime() + jobDuration)
      );

      await setOtpStatus(otpId, OTPStatus.EXPIRED).then(async () => {
        await changeJobStatus(jobid, JobStatus.COMPLETED);
      });
    }
  }
);

const taskPoller = inngest.createFunction(
  {
    id: "task-poller-scheduled",
    name: "Task Poller",
    cancelOn: [
      {
        event: "europay/TaskPoller.suspend",
        // ensure the async (future) event's userId matches the trigger userId
        match: "data.jobid",
      },
    ],
  },
  { event: "europay/TaskPoller" },
  async ({ event, step }) => {
    const { jobid, delayexpression } = event.data;

    await step.run("run-job", async () => {
      await changeJobStatus(jobid, JobStatus.RUNNING).then(async () => {
        const tasks: number = -1;

        await fetch(
          absoluteUrl(`/api/notification/send?key=${taskKey}&value=${tasks}`)
        );
      });
    });

    await step.sleep("delay-job", delayexpression);

    await step.run("complete-job", async () => {
      const tasks: number = await countNonCompletedTasks();

      await changeJobStatus(jobid, JobStatus.COMPLETED).then(async () => {
        await fetch(
          absoluteUrl(`/api/notification/send?key=${taskKey}&value=${tasks}`)
        );
      });
    });

    await step.sendEvent("reactivate-job", {
      name: "europay/TaskPoller",
      data: { jobid: jobid, delayexpression: delayexpression },
    });
  }
);

const transactionPoller = inngest.createFunction(
  {
    id: "transaction-poller-scheduled",
    name: "Transaction Poller",
    cancelOn: [
      {
        event: "europay/TransactionPoller.suspend",
        // ensure the async (future) event's userId matches the trigger userId
        match: "data.jobid",
      },
    ],
  },
  { event: "europay/TransactionPoller" },
  async ({ event, step }) => {
    const { jobid, userid, delayexpression } = event.data;

    await step.run("run-job", async () => {
      const transactions: number = -1;
      await changeJobStatus(jobid, JobStatus.RUNNING).then(async () => {
        await fetch(
          absoluteUrl(
            `/api/notification/send?key=${transactionKey}:${userid}&value=${transactions}`
          )
        );
      });
    });

    await step.sleep("delay-job", delayexpression);

    await step.run("complete-job", async () => {
      const transactions: number = await getNrOfTransactions(userid);

      await changeJobStatus(jobid, JobStatus.COMPLETED).then(async () => {
        await fetch(
          absoluteUrl(
            `/api/notification/send?key=${transactionKey}:${userid}&value=${transactions}`
          )
        );
      });
    });

    await step.sendEvent("reactivate-job", {
      name: "europay/TransactionPoller",
      data: { jobid: jobid, userid: userid, delayexpression: delayexpression },
    });
  }
);

// create here the test functions
export const inngestfunctions = [createOTPJob, taskPoller, transactionPoller];
