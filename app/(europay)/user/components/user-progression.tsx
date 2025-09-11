"use client";

import {
  getFirstDayOfThisMonth,
  getLastDayOfThisMonth,
} from "@/app/client/date";
import { getTransactionsByDates } from "@/app/server/transaction";
import { TransactionStatus } from "@/generated/prisma";
import { useTransaction } from "@/hooks/use-transaction";
import { useUser } from "@/hooks/use-user";
import { cDefaultPeriodValues } from "@/lib/constants";
import { tTransaction, tUser } from "@/lib/prisma-types";
import { json } from "@/lib/util";
import { tPeriodValues } from "@/types";
import TrendingProgress from "@/ui/charts/trending-progress";
import { useEffect, useState } from "react";

type AmountInfo = {
  transactionDate: Date;
  dayOfTheMonth: number;
  accountAmountBeforeTransaction: number;
  transactionAmount: number;
};

const UserProgression = () => {
  const { user } = useUser();
  const { transactions } = useTransaction();

  const [values, setValues] = useState<tPeriodValues>(cDefaultPeriodValues);

  // const getAccountAmount = (
  //   _user: tUser,
  //   transaction: tTransaction
  // ): number => {
  //   if (transaction.receiver === _user.email) {
  //     return transaction.receiverAccountAmount!;
  //   }

  //   return transaction.senderAccountAmount;
  // };

  // const getTransactionAmount = (
  //   _user: tUser,
  //   transaction: tTransaction
  // ): number => {
  //   if (transaction.status === TransactionStatus.COMPLETED && transaction.receiver === _user.email) {
  //     return transaction.receiverAmount;
  //   }

  //   return transaction.senderAmount * -1;
  // };

  // const calculateAmounts = (
  //   _user: tUser,
  //   _transactions: tTransaction[]
  // ): AmountInfo[] => {
  //   let amounts: AmountInfo[] = [];
  //   if (_transactions.length > 0) {
  //     amounts = _transactions.reduce<AmountInfo[]>(
  //       (acc: AmountInfo[], currentTransaction: tTransaction) => {
  //         const tDate: Date = currentTransaction.createDate!;
  //         const accountAmount: number = getAccountAmount(
  //           _user,
  //           currentTransaction
  //         );
  //         const tAmount: number = getTransactionAmount(
  //           _user,
  //           currentTransaction
  //         );

  //         let _index: number = 0;
  //         if (
  //           acc.some((value: AmountInfo, index: number) => {
  //             _index = index;
  //             let infodate: Date = value.transactionDate;
  //             infodate.setHours(0, 0, 0, 0);
  //             let transactiondate: Date = tDate;
  //             transactiondate.setHours(0, 0, 0, 0);

  //             return infodate.getTime() === transactiondate.getTime();
  //           })
  //         ) {
  //           acc[_index].transactionAmount += tAmount;
  //         } else {
  //           const info: AmountInfo = {
  //             transactionDate: tDate,
  //             dayOfTheMonth: tDate.getDate(),
  //             accountAmountBeforeTransaction: accountAmount,
  //             transactionAmount: tAmount,
  //           };

  //           acc.push(info);
  //         }

  //         return acc;
  //       },
  //       []
  //     );
  //   } else {
  //     amounts.push({
  //       dayOfTheMonth: 1,
  //       accountAmountBeforeTransaction: 0,
  //       transactionAmount: 0,
  //       transactionDate: new Date(),
  //     });
  //   }

  //   return amounts;
  // };

  const calculateTrend = async (_accountid: number): Promise<void> => {
    const firstDayOfThisMonth: Date = getFirstDayOfThisMonth();
    const lastDayOfThisMonth: Date = getLastDayOfThisMonth();

    const transactionsThisMonth: tTransaction[] = await getTransactionsByDates(
      _accountid,
      firstDayOfThisMonth,
      lastDayOfThisMonth
    );

    console.log(
      "[BREAK]",
      "Transactions of this month",
      json(transactionsThisMonth)
    );

    // let amounts: AmountInfo[] = calculateAmounts(
    //   user as tUser,
    //   transactionsThisMonth
    // );

    // const accountTotalThisMonth: number =
    //   amounts[amounts.length - 1].accountAmountBeforeTransaction +
    //   amounts[amounts.length - 1].transactionAmount;

    // const firstDayOfPreviousMonth: Date = getFirstDayOfPreviousMonth();
    // const lastDayOfPreviousMonth: Date = getLastDayOfPreviousMonth();

    // const transactionsPreviousMonth: tTransaction[] =
    //   await getTransactionsByDates(
    //     _accountid,
    //     firstDayOfPreviousMonth,
    //     lastDayOfPreviousMonth
    //   );

    // amounts = calculateAmounts(user as tUser, transactionsPreviousMonth);

    // const accountTotalPreviousMonth: number =
    //   amounts[amounts.length - 1].accountAmountBeforeTransaction +
    //   amounts[amounts.length - 1].transactionAmount;

    // let periodValues: tPeriodValues = {
    //   previous: accountTotalPreviousMonth,
    //   current: accountTotalThisMonth,
    // };

    // setValues(periodValues);
  };

  useEffect(() => {
    if (user && user.account) {
      calculateTrend(user.account.id);
    }
  }, [transactions]);

  useEffect(() => {
    if (user && user.account) {
      calculateTrend(user.account.id);
    }
  }, []);

  return (
    <TrendingProgress
      _previousPeriodValue={values.previous}
      _thisPeriodValue={values.current}
      _currency={user?.address?.country?.currencycode!}
    />
  );
};

export default UserProgression;
