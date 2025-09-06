"use server";

import prisma from "@/lib/prisma";
import { cWhatToSelectFromAccount } from "@/lib/prisma-types";
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
