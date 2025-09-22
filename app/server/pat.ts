"use server";

import { TokenStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { encrypt } from "./encrypt";

export const createPat = async (
  _userid: number,
  _tokenname: string,
  _token: string,
  _expirationdate: Date | null,
  _delay: number = 0,
  _status: TokenStatus = TokenStatus.ACTIVE
): Promise<void> => {
  await prisma.userPAT.create({
    data: {
      tokenName: await encrypt(_tokenname),
      token: await encrypt(_token),
      tokenStatus: _status,
      expirationDate: _expirationdate,
      delay: _delay,
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
