"use client";

import { useTransaction } from "@/hooks/use-transaction";
import { useUser } from "@/hooks/use-user";
import { tTransaction } from "@/lib/prisma-types";
import { ScrollArea, ScrollBar } from "@/ui/radix/scroll-area";
import { useEffect, useState } from "react";
import TransactionItem from "./transaction-item";
import {
  loadTransactionsByUsernameOrEmailAsReceiver,
  loadTransactionsByUsernameOrEmailAsSender,
} from "@/app/server/transaction";

const UserTransactionsList = () => {
  const { transactions } = useTransaction();
  const { user } = useUser();

  const [loadedTransactions, setLoadedTransactions] = useState<tTransaction[]>(
    []
  );

  const loadUserTransactions = async (): Promise<void> => {
    if (user && user.account) {
      const username: string | null = user.username;
      const usermail: string = user.email;

      const outgoingtransactions: tTransaction[] =
        await loadTransactionsByUsernameOrEmailAsSender(username, usermail);
      console.log(
        "[UserTransactionsList]",
        "outgoing transactions",
        outgoingtransactions
      );

      const incomingtransactions: tTransaction[] =
        await loadTransactionsByUsernameOrEmailAsReceiver(username, usermail);
      console.log(
        "[UserTransactionsList]",
        "incoming transactions",
        incomingtransactions
      );

      const transactions: tTransaction[] = [
        ...incomingtransactions,
        ...outgoingtransactions,
      ];
      console.log(
        "[UserTransactionsList]",
        "ALL transactions",
        transactions.sort(
          (t1: tTransaction, t2: tTransaction) =>
            t2.transactionDate.getTime() - t1.transactionDate.getTime()
        )
      );

      setLoadedTransactions(transactions);
    }
  };

  // useEffect(() => {
  //   loadUserTransactions();
  // }, []);

  useEffect(() => {
    loadUserTransactions();
  }, [transactions]);

  return (
    <ul className="list bg-base-100 rounded-box shadow-md text-xs">
      <ScrollArea className="overflow-auto h-[42vw] w-[100%]">
        {loadedTransactions.map((_transaction: tTransaction) => (
          <li key={_transaction.id}>
            <TransactionItem transaction={_transaction} user={user} />
          </li>
        ))}
        <ScrollBar className="bg-foreground/30" />
      </ScrollArea>
    </ul>
  );
};

export default UserTransactionsList;
