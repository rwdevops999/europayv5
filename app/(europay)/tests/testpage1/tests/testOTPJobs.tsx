"use client";

import Button from "@/ui/button";
import { createOTP } from "@/app/server/otp";
import { tOTPCreate } from "@/lib/prisma-types";

const TestOTPJobs = () => {
  const createOTPJob = async (
    _name: string,
    _id: number,
    _expiration: Date
  ) => {
    const dInMs: number = Date.now();
    const duration: number = 5 * 60 * 1000;
    const ed: Date = new Date(dInMs + duration);

    const otp: tOTPCreate = {
      OTP: "123456",
      createDate: new Date(dInMs),
      email: "test@test.com",
      expirationDate: ed,
    };

    await createOTP(otp).then(async (id: number | null) => {
      if (id) {
        // await createOtpJobonInngest(`OTP${id}`, id, duration);
      }
    });
  };

  const handleCreateOTPJob = (): void => {
    createOTPJob("tesOTP", 123, new Date());
  };

  return <Button name="Create OTP job" onClick={handleCreateOTPJob} />;
};

export default TestOTPJobs;
