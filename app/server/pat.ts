"use server";

import { TokenStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export const createPat = async (
  _userid: number,
  _tokenname: string,
  _token: string,
  _expirationdate: Date | null,
  _status: TokenStatus = TokenStatus.ACTIVE
): Promise<void> => {
  await prisma.userPAT.create({
    data: {
      tokenName: _tokenname,
      token: _token,
      tokenStatus: _status,
      expirationDate: _expirationdate,
      user: {
        connect: {
          id: _userid,
        },
      },
    },
  });
};

export const deletePatById = async (_id: number): Promise<void> => {
  await prisma.userPAT.delete({
    where: {
      id: _id,
    },
  });
};
