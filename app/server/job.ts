"use server";

import { tJob, tOTP } from "@/lib/prisma-types";
import prisma from "@/lib/prisma";
import { JobModel, JobStatus } from "@/generated/prisma";
import { json } from "@/lib/util";
import { loadOTPById } from "./otp";
import { inngest } from "../inngest/client";

const createJob = async (
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
        description: "OTP job",
        model: _model,
        status: _status,
        data: _data,
      },
    })
    .then((value: tJob) => (result = value));

  return result;
};

export const createOtpJob = async (_otpid: number): Promise<tJob | null> => {
  console.log("handleCreateJob");

  let result: tJob | null = null;

  if (_otpid) {
    const otp: tOTP | null = await loadOTPById(_otpid);

    if (otp) {
      console.log("handleCreateStartJob", "OTP Found", _otpid);

      const jobName = `OTP${_otpid}`;

      const job: tJob | null = await createJob(jobName, JobModel.SERVER, {
        otpid: otp.id,
        expirationdate: otp.expirationDate,
      });

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

export const clearRunningJobs = async (): Promise<void> => {
  console.log("Suspend Running Jobs");
  await prisma.job
    .findMany({
      where: {
        status: JobStatus.RUNNING,
      },
    })
    .then(async (values: tJob[]) => {
      for (let i = 0; i < values.length; i++) {
        console.log("Suspend Running Jobs", values[i].id);
        await suspendInngestOtpJob(values[i].id);
      }
    });

  console.log("Clearing Running Jobs");
  await prisma.job.deleteMany({
    where: {
      status: JobStatus.RUNNING,
    },
  });
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
  console.log("CHECKING EXISTING JOBS FOR OTP", _otpid, json(jobs));

  if (jobs.length > 0) {
    jobs.forEach((job: tJob) => {
      const data: any = job.data;
      console.log("CHECKING JOB FOR OTP", job.id, json(data));

      if (job.status === JobStatus.RUNNING && data && data.otpid === _otpid) {
        console.log("FOUND JOB FOR OTP", job.id);
        result = job;
      }
    });
  }

  return result;
};
