"use server";

import prisma from "@/lib/prisma";
import { cWhatToSelectFromAccount, tAccount } from "@/lib/prisma-types";
import { equal } from "assert";

export const updateAccountAmount = async (
  _accountId: number,
  _amount: number
): Promise<void> => {
  await prisma.account.update({
    where: {
      id: _accountId,
    },
    data: {
      amount: {
        increment: _amount,
      },
    },
  });
};

export const getAccountAmount = async (
  _accountId: number | undefined,
  _currencyCode: string
): Promise<string> => {
  let result: string = "";

  await prisma.account
    .findFirst({
      where: {
        id: _accountId,
      },
      ...cWhatToSelectFromAccount,
    })
    .then((value: tAccount | null) => {
      if (value) {
        result = value.amount.toFixed(2);
      }
    });

  return result;
};
