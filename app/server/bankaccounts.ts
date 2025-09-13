"use server";

import prisma from "@/lib/prisma";
import { IBANStatus } from "@/generated/prisma";
import { cWhatToSelectFromBankaccount, tBankaccount } from "@/lib/prisma-types";

export const linkBankAccount = async (
  _iban: string,
  _accountid: number,
  _status: IBANStatus
): Promise<void> => {
  await prisma.bankAccount.create({
    data: {
      status: _status,
      IBAN: _iban,
      account: {
        connect: {
          id: _accountid,
        },
      },
    },
    ...cWhatToSelectFromBankaccount,
  });
};

export const loadLinkedBankAccounts = async (
  _accountid: number
): Promise<tBankaccount[]> => {
  let result: tBankaccount[] = [];

  await prisma.bankAccount
    .findMany({
      where: {
        accountId: _accountid,
      },
      ...cWhatToSelectFromBankaccount,
    })
    .then((values: tBankaccount[]) => (result = values));

  return result;
};

export const deleteBankAccountById = async (
  _accountid: number
): Promise<void> => {
  await prisma.bankAccount.delete({
    where: { id: _accountid },
  });
};

export const loadBankAccountById = async (
  _accountid: number
): Promise<tBankaccount | null> => {
  let result: tBankaccount | null = null;

  await prisma.bankAccount
    .findFirst({
      where: { id: _accountid },
      ...cWhatToSelectFromBankaccount,
    })
    .then((value: tBankaccount | null) => (result = value));

  return result;
};
