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
  async ({ event }) => {
    const { jobid, userid } = event.data;
    console.log("[INNGEST] : TransactionPoller (JOB, USER)", jobid, userid);
    await prisma.transaction
      .count({
        where: {
          AND: [
            {
              parties: {
                has: userid,
              },
            },
            {
              OR: [
                {
                  status: TransactionStatus.PENDING,
                },
                {
                  status: TransactionStatus.COMPLETED,
                },
                {
                  status: TransactionStatus.REJECTED,
                },
              ],
            },
          ],
        },
      })
      .then(async (_value: number) => {
        console.log(
          "[INNGEST] : SEND (KEY, VALUE)",
          `${transactionKey}:${userid}`,
          _value
        );
        await fetch(
          absoluteUrl(
            `/api/notification/send?key=${transactionKey}:${userid}&value=${_value}`
          )
        );
      });
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
      await changeJobStatus(jobid, JobStatus.RUNNING);
    });

    await step.sleep("delay-job", delayexpression);

    await step.run("complete-job", async () => {
      const tasks: number = await countNonCompletedTasks();

      await fetch(
        absoluteUrl(`/api/notification/send?key=${taskKey}&value=${tasks}`)
      ).then(async () => {
        await changeJobStatus(jobid, JobStatus.COMPLETED);
      });
    });

    await step.sendEvent("reactivate-job", {
      name: "europay/TaskPoller",
      data: { jobid: jobid, delayexpression: delayexpression },
    });
  }
);

//   const { jobid } = event.data;

//   await prisma.task
//     .count({
//       where: {
//         OR: [
//           {
//             status: TaskStatus.CREATED,
//           },
//           {
//             status: TaskStatus.OPEN,
//           },
//         ],
//       },
//     })
//     .then(async (_value: number) => {
//       await changeJobStatus(jobid, JobStatus.RUNNING).then(async () => {
//         await fetch(
//           absoluteUrl(`/api/notification/send?key=${taskKey}&value=${_value}`)
//         );
//       });
//     });
// }

// create here the test functions
const testJob = inngest.createFunction(
  {
    id: "test-job",
    name: "Test Job",
    cancelOn: [
      {
        event: "europay/TestJobEvent.suspend",
        // ensure the async (future) event's userId matches the trigger userId
        match: "data.jobid",
      },
    ],
  },
  {
    event: "europay/TestJobEvent",
  },
  async ({ event, step }) => {
    const { jobid, delayexpression } = event.data;

    await step.run("step1", async () => {
      console.log("Test Job RUN", "STEP1");
      console.log("Test Job RUN", "HERE WE SET JOB TO STATUS RUNNING");
    });

    await step.sleep("wait-a-moment", delayexpression);

    await step.run("step2", async () => {
      console.log("Test Job RUN", "STEP2");
      console.log("Test Job RUN", "HERE WE SEND DATA TO CLIENT");
      console.log("Test Job RUN", "AND WE SET JOB TO STATUS COMPLETED");
    });

    await step.sendEvent("send-reactivate-job", {
      name: "europay/TestJobEvent",
      data: { jobid: jobid, delayexpression: delayexpression },
    });
  }
);

export const inngestfunctions = [
  createOTPJob,
  taskPoller,
  transactionPoller,
  testJob,
];
