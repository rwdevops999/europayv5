"use server";

import { OTPStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { tOTP, tOTPCreate } from "@/lib/prisma-types";

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
