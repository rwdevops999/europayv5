import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { tJob } from "@/lib/prisma-types";
import { JobStatus, OTPStatus, TaskStatus } from "@/generated/prisma";
import { changeJobStatus, findJobByName, loadJobById } from "../server/job";
import { absoluteUrl } from "@/lib/util";
import { taskKey, TaskPollerJobName } from "@/lib/constants";
import { setOtpStatus } from "../server/otp";

const createClientJob = inngest.createFunction(
  { id: "create-client-job", name: "Create Client Job" },
  { event: "europay/create.client.job" },
  async ({ event }) => {
    // await prisma.job
    //   .create({
    //     data: {
    //       jobname: event.data.jobname,
    //       status: JobStatus.RUNNING,
    //       description: event.data.jobdescription,
    //       model: JobModel.CLIENT,
    //     },
    //   })
    //   .catch((reason: any) => {});
  }
);

const transactionPoller = inngest.createFunction(
  { id: "transaction-poller-scheduled", name: "Transaction Poller" },
  { event: "europay/TransactionPoller" },
  async ({ event }) => {
    // await prisma.transaction.count().then(async (_value: number) => {
    //   await sendClientData({ name: "TransactionPoller", value: _value });
    // });

    return {
      message: `Transaction Poller did run now: ${Date.now().toString()}`,
    };
  }
);

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

    console.log("[OTPJOB]", "RUNNING FOR", jobid);

    const job: tJob | null = await loadJobById(jobid);

    if (job) {
      console.log("[OTPJOB]", "JOB FOUND", jobid);
      const data: any = job.data;

      const otpId: number = data.otpid;
      const now: Date = new Date(Date.now());
      const expirationdate: Date = new Date(data.expirationdate);

      const jobDuration = expirationdate.getTime() - now.getTime();

      const jobName = `OTP${otpId}`;

      console.log("[OTPJOB]", "GO TO SLEEP");
      await step.sleepUntil(
        `run ${jobName}`,
        new Date(now.getTime() + jobDuration)
      );

      console.log("[OTPJOB] WOKE UP", jobid);
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
  async ({ event }) => {
    console.log("[taskPoller] RUN TASKPOLLER JOB");

    console.log("[taskPoller] ... lookup job in DB", TaskPollerJobName);
    await prisma.task
      .count({
        where: {
          OR: [
            {
              status: TaskStatus.CREATED,
            },
            {
              status: TaskStatus.OPEN,
            },
          ],
        },
      })
      .then(async (_value: number) => {
        console.log("[taskPoller] ... SEND DATA To CLIENT", taskKey, _value);
        await fetch(
          absoluteUrl(`/api/notification/send?key=${taskKey}&value=${_value}`)
        );
      });
  }
);

export const inngestfunctions = [createOTPJob, taskPoller];
