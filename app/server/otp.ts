"use server";

import { JobStatus, OTPStatus, Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { tJob, tOTP, tOTPCreate } from "@/lib/prisma-types";
import {
  changeJobStatus,
  createOtpJob,
  deleteJob,
  findOtpJobOfOtpId,
  runInngestOtpJob,
  suspendInngestOtpJob,
} from "./job";
import { json } from "@/lib/util";

export const createOTP = async (_otp: tOTPCreate): Promise<number | null> => {
  let result: number | null = null;

  await prisma.oTP
    .create({
      data: _otp,
    })
    .then((otp: tOTP) => (result = otp.id));

  return result;
};

export const otpHasValidCode = async (_email: string): Promise<boolean> => {
  let result: boolean = false;

  await prisma.oTP
    .findFirst({
      where: {
        email: _email,
        AND: {
          status: {
            equals: OTPStatus.ONGOING,
          },
        },
      },
    })
    .then((value: tOTP | null) => {
      if (value) {
        result = true;
      }
    });

  return result;
};

export const loadOTPByOtpCode = async (
  _otpcode: string
): Promise<tOTP | null> => {
  let result: tOTP | null = null;

  const t0 = Date.now();
  await prisma.oTP
    .findFirst({
      where: {
        OTP: {
          equals: _otpcode,
        },
      },
    })
    .then((value: tOTP | null) => {
      const d = Date.now() - t0;
      result = value;
    });

  return result;
};

export const loadOTPById = async (_otpid: number): Promise<tOTP | null> => {
  let result: tOTP | null = null;

  await prisma.oTP
    .findFirst({
      where: {
        id: _otpid,
      },
    })
    .then((value: tOTP | null) => {
      result = value;
    });

  return result;
};

export const setOtpStatus = async (
  _id: number,
  _status: OTPStatus
): Promise<void> => {
  await prisma.oTP.update({
    where: {
      id: _id,
    },
    data: {
      status: _status,
    },
  });
};

const removeExpiredOtps = async (): Promise<void> => {
  const now: Date = new Date(Date.now());

  await prisma.oTP.updateMany({
    where: {
      AND: [
        {
          status: {
            equals: OTPStatus.ONGOING,
          },
        },
        {
          expirationDate: {
            lt: now,
          },
        },
      ],
    },
    data: {
      status: OTPStatus.EXPIRED,
    },
  });
};

export const processOtpsOnServer = async (): Promise<void> => {
  await removeExpiredOtps().then(async () => {
    const otps: tOTP[] = await prisma.oTP.findMany({
      where: {
        status: {
          equals: OTPStatus.ONGOING,
        },
      },
    });

    for (let i = 0; i < otps.length; i++) {
      const otpid: number = otps[i].id;

      let job: tJob | null = await createOtpJob(otpid);

      if (job) {
        await changeJobStatus(job.id, JobStatus.RUNNING).then(async () => {
          await runInngestOtpJob(job.id);
        });
      }
    }
  });
};

export const countOngoingOTPs = async (): Promise<number> => {
  let result: number = 0;

  await prisma.oTP
    .count({
      where: {
        status: {
          equals: OTPStatus.ONGOING,
        },
      },
    })
    .then((value: number) => (result = value));

  return result;
};
