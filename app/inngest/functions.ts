import { inngest } from "./client";
import prisma from "@/lib/prisma";
import { tJob, tOTP } from "@/lib/prisma-types";
import { JobModel, JobStatus, OTPStatus } from "@/generated/prisma";
import { loadOTPById, setOtpStatus } from "../server/otp";
import { changeJobStatus, loadJobById } from "../server/job";
import { json } from "@/lib/util";

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

const taskPoller = inngest.createFunction(
  { id: "task-poller-scheduled", name: "Task Poller" },
  { event: "europay/TaskPoller" },
  async ({ event }) => {
    // await prisma.task
    //   .count({
    //     where: {
    //       OR: [
    //         {
    //           status: TaskStatus.CREATED,
    //         },
    //         {
    //           status: TaskStatus.OPEN,
    //         },
    //       ],
    //     },
    //   })
    //   .then(async (_value: number) => {
    //     await sendClientData({ name: "TaskPoller", value: _value });
    //   });

    return { message: `Task Poller did run now: ${Date.now().toString()}` };
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
            console.log("Running Job", jobid);
          });
      }
    }
  }
);

export const inngestfunctions = [createOTPJob];
