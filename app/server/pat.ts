"use server";

import { TokenStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { decrypt, encrypt } from "./encrypt";
import { tUserPat } from "@/lib/prisma-types";

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

export const existPATByTokenname = async (_name: string): Promise<boolean> => {
  let result: boolean = false;

  await prisma.userPAT
    .findMany({
      where: {
        tokenStatus: TokenStatus.ACTIVE,
      },
      select: {
        tokenName: true,
      },
    })
    .then(async (values: any[]) => {
      for (let i = 0; i < values.length; i++) {
        const token: string = await decrypt(values[i].tokenName);
        if (token === _name) {
          result = true;
        }
      }
    });

  return result;
};
