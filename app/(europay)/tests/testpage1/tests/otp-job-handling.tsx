"use client";

import {
  changeJobStatus,
  createOtpJob,
  runInngestOtpJob,
  suspendInngestOtpJob,
} from "@/app/server/job";
import { createOTP } from "@/app/server/otp";
import { JobStatus } from "@/generated/prisma";
import { tJob, tOTPCreate } from "@/lib/prisma-types";
import { json } from "@/lib/util";
import Button from "@/ui/button";
import React, { useState } from "react";

const duration: number = 5 * 60 * 1000;

const OtpJobHandling = () => {
  const [otpId, setOtpId] = useState<number | null>(null);

  const handleCreateOTP = async (): Promise<void> => {
    const expirationDate: Date = new Date(Date.now() + duration);

    const otp: tOTPCreate = {
      OTP: "123456",
      createDate: new Date(Date.now()),
      email: "test@test.com",
      expirationDate: expirationDate,
    };

    await createOTP(otp).then((id: number | null) => {
      setOtpId(id);
    });
  };

  const [job, setJob] = useState<tJob | null>(null);

  const handleCreateJob = async (): Promise<void> => {
    if (otpId) {
      setJob(await createOtpJob(otpId));
    }
  };

  const handleStartJob = async (): Promise<void> => {
    if (job) {
      // change job status here
      await changeJobStatus(job.id, JobStatus.RUNNING).then(async () => {
        await runInngestOtpJob(job.id);
      });
    }
  };

  const handleSuspendJob = async (): Promise<void> => {
    if (job) {
      await changeJobStatus(job.id, JobStatus.SUSPENDED).then(async () => {
        await suspendInngestOtpJob(job.id);
      });
    }
  };

  const handleRestartJob = async (): Promise<void> => {
    if (job) {
      await changeJobStatus(job.id, JobStatus.RUNNING).then(async () => {
        await runInngestOtpJob(job.id);
      });
    }
  };

  return (
    <div className="flex justify-between space-x-5">
      <Button name="Create OTP" onClick={handleCreateOTP} />
      <Button name="Create Job" onClick={handleCreateJob} />
      <Button name="Start Job" onClick={handleStartJob} />
      <Button name="Suspend Job" onClick={handleSuspendJob} />
      <Button name="Restart Job" onClick={handleRestartJob} />
    </div>
  );
};

export default OtpJobHandling;
