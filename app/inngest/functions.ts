import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { tJob } from "@/lib/prisma-types";
import { JobStatus, TaskStatus } from "@/generated/prisma";
import { findJobByName, loadJobById } from "../server/job";
import { absoluteUrl } from "@/lib/util";

const taskkey: string = "key:task";

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

    const job: tJob | null = await loadJobById(jobid);

    if (job) {
      const data: any = job.data;

      const otpId: number = data.otpid;
      const now: Date = new Date(Date.now());
      const expirationdate: Date = new Date(data.expirationdate);

      if (expirationdate.getTime() > now.getTime()) {
        const jobDuration = expirationdate.getTime() - now.getTime();

        const jobName = `OTP${otpId}`;

        await step
          .sleepUntil(`run ${jobName}`, new Date(now.getTime() + jobDuration))
          .then(async () => {
            // TODO implement
            console.log("Running Job", jobid);
          });
      }
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

    console.log("[taskPoller] ... lookup job in DB", "TaskPoller");
    const job: tJob | null = await findJobByName("TaskPoller");

    if (job && job.status === JobStatus.RUNNING) {
      console.log("[taskPoller] ... job found and it is RUNNING", job.id);
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
          console.log(
            "[taskPoller] ... SEND DATA To CLIENT",
            taskkey,
            _value,
            job.id
          );
          await fetch(
            absoluteUrl(
              `/api/notification/send?key=${taskkey}&value=${_value}&jobid=${job.id}`
            )
          );
        });
    }
  }
);

export const inngestfunctions = [createOTPJob, taskPoller];
