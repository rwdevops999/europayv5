"use client";

import { loadTransactionByAccountId } from "@/app/server/transaction";
import { useTransaction } from "@/hooks/use-transaction";
import { useUser } from "@/hooks/use-user";
import { tTransaction } from "@/lib/prisma-types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useEffect, useState } from "react";
import TransactionItem from "./transaction-item";
import { ScrollBar } from "@/ui/radix/scroll-area";

const UserTransactionsList = () => {
  const { transactions } = useTransaction();
  const { user } = useUser();

  const [loadedTransactions, setLoadedTransactions] = useState<tTransaction[]>(
    []
  );

  const loadUserTransactions = async (): Promise<void> => {
    let transactions: tTransaction[] = [];

    if (user && user.account) {
      transactions = await loadTransactionByAccountId(user.account.id);

      setLoadedTransactions(transactions);
    }
  };

  useEffect(() => {
    loadUserTransactions();
  }, []);

  useEffect(() => {
    loadUserTransactions();
  }, [transactions]);

  return (
    <ul className="list bg-base-100 rounded-box shadow-md">
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
