"use client";

import Button from "@/ui/button";
import moment from "moment";
import { createOTP } from "@/app/server/otp";
import { tOTPCreate } from "@/lib/prisma-types";

const TestOTPJobs = () => {
  const createOTPJob = async (
    _name: string,
    _id: number,
    _expiration: Date
  ) => {
    console.log("TEST OTP");
    const dInMs: number = Date.now();
    const duration: number = 5 * 60 * 1000;
    const ed: Date = new Date(dInMs + duration);

    const otp: tOTPCreate = {
      OTP: "123456",
      createDate: new Date(dInMs),
      email: "test@test.com",
      expirationDate: ed,
    };

    console.log("Create OTP");
    await createOTP(otp).then(async (id: number | null) => {
      console.log("OTP Created");
      if (id) {
        console.log("Create OTP Job");
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
