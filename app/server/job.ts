"use server";

import { tJob, tOTP } from "@/lib/prisma-types";
import prisma from "@/lib/prisma";
import { JobModel, JobStatus } from "@/generated/prisma";
import { json } from "@/lib/util";
import { loadOTPById } from "./otp";
import { inngest } from "../inngest/client";
import { cleanDbTables } from "./app-tables";

export const createJob = async (
  _jobname: string,
  _model: JobModel,
  _data: any,
  _status: JobStatus = JobStatus.CREATED
): Promise<tJob | null> => {
  let result: tJob | null = null;

  await prisma.job
    .create({
      data: {
        jobname: _jobname,
        description: "Inngest job",
        model: _model,
        status: _status,
        data: _data,
      },
    })
    .then((value: tJob) => (result = value));

  return result;
};

export const createOtpJob = async (
  _otpid: number,
  _status: JobStatus = JobStatus.CREATED
): Promise<tJob | null> => {
  let result: tJob | null = null;

  if (_otpid) {
    const otp: tOTP | null = await loadOTPById(_otpid);

    if (otp) {
      const jobName = `OTP${_otpid}`;

      const job: tJob | null = await createJob(
        jobName,
        JobModel.SERVER,
        {
          otpid: otp.id,
          expirationdate: otp.expirationDate,
        },
        _status
      );

      result = job;
    }
  }

  return result;
};

export const loadJobById = async (_id: number): Promise<tJob | null> => {
  let result: tJob | null = null;

  await prisma.job
    .findFirst({
      where: {
        id: _id,
      },
    })
    .then((value: tJob | null) => (result = value));

  return result;
};

export const runInngestOtpJob = async (_jobid: number): Promise<void> => {
  await inngest.send({
    name: "europay/otpjob.create",
    data: {
      jobid: _jobid,
    },
  });
};

export const suspendInngestOtpJob = async (_jobid: number): Promise<void> => {
  await inngest.send({
    name: "europay/otpjob.suspend",
    data: {
      jobid: _jobid,
    },
  });
};

export const changeJobStatus = async (
  _id: number,
  _status: JobStatus
): Promise<void> => {
  await prisma.job.update({
    where: {
      id: _id,
    },
    data: {
      status: _status,
    },
  });
};

export const clearRunningJobs = async (
  _type: JobModel,
  _resetTable: boolean = false
): Promise<boolean> => {
  let result: boolean = false;
  let suspended: boolean = false;

  await prisma.job
    .findMany({
      where: {
        AND: [
          {
            model: _type,
          },
          {
            status: JobStatus.RUNNING,
          },
        ],
      },
    })
    .then(async (values: tJob[]) => {
      if (values.length === 0) {
        suspended = true;
      } else {
        for (let i = 0; i < values.length; i++) {
          const job: tJob = values[i];

          if (_type === JobModel.SERVER) {
            await suspendInngestOtpJob(job.id).then(() => {
              suspended = true;
            });
          } else {
            await suspendInngestJob(job.jobname, job.id).then(
              () => (suspended = true)
            );
          }
        }
      }
    });

  if (_resetTable) {
    await cleanDbTables(["jobs"]).then(() => {
      result = suspended && true;
    });
  } else {
    await prisma.job
      .deleteMany({
        where: {
          AND: [
            {
              model: _type,
            },
            {
              status: JobStatus.RUNNING,
            },
          ],
        },
      })
      .then(() => {
        result = suspended && true;
      });
  }

  return result;
};

export const loadJobs = async (): Promise<tJob[]> => {
  let result: tJob[] = [];

  await prisma.job.findMany().then((values: tJob[]) => (result = values));

  return result;
};

export const deleteJob = async (_jobid: number): Promise<void> => {
  await prisma.job.delete({
    where: {
      id: _jobid,
    },
  });
};

export const findOtpJobOfOtpId = async (
  _otpid: number
): Promise<tJob | null> => {
  let result: tJob | null = null;

  const jobs: tJob[] = await prisma.job.findMany();

  if (jobs.length > 0) {
    jobs.forEach((job: tJob) => {
      const data: any = job.data;
      if (job.status === JobStatus.RUNNING && data && data.otpid === _otpid) {
        result = job;
      }
    });
  }

  return result;
};

export const findJobByName = async (_name: string): Promise<tJob | null> => {
  let result: tJob | null = null;

  await prisma.job
    .findFirst({
      where: {
        jobname: _name,
      },
      orderBy: {
        id: "desc",
      },
    })
    .then((value: tJob | null) => (result = value));

  return result;
};

export const findJobById = async (_id: number): Promise<tJob | null> => {
  let result: tJob | null = null;

  console.log("[JOB]:findJobById", _id);
  await prisma.job
    .findFirst({
      where: {
        id: _id,
      },
    })
    .then((value: tJob | null) => {
      console.log("[JOB]:findJobById", "Job", json(value));
      result = value;
    });

  return result;
};

export const runInngestJob = async (
  _name: string,
  _data: any
): Promise<void> => {
  await inngest.send({
    name: `europay/${_name}`,
    data: _data,
  });
};

export const suspendInngestJob = async (
  _name: string,
  _data: any
): Promise<void> => {
  await inngest.send({
    name: `europay/${_name}.suspend`,
    data: _data,
  });
};
