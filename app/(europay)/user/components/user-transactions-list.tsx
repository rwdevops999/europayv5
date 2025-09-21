"use client";

import { loadTransactionByAccountId } from "@/app/server/transaction";
import { useTransaction } from "@/hooks/use-transaction";
import { useUser } from "@/hooks/use-user";
import { tTransaction } from "@/lib/prisma-types";
import { useEffect, useState } from "react";
import TransactionItem from "./transaction-item";
import { ScrollArea, ScrollBar } from "@/ui/radix/scroll-area";

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

      console.log("TRANSACTION LOADED");
      setLoadedTransactions(transactions);

      const element = document.getElementById("key0");
      if (element) {
        console.log("SCROLL TO 0");
        element.scrollIntoView();
      }
    }
  };

  useEffect(() => {
    loadUserTransactions();
  }, []);

  useEffect(() => {
    console.log("[UserTransactionsList]:UE[transactions]");
    loadUserTransactions();
  }, [transactions]);

  return (
    <div className="h-[78vh]">
      <div>
        <ScrollArea className="overflow-auto h-[640px] w-[100%]">
          <div id={"key0"} key={"key" + 0}></div>
          {loadedTransactions.map((_transaction: tTransaction) => (
            <div className="text-xs w-[97%]" key={_transaction.id}>
              <TransactionItem transaction={_transaction} user={user} />
            </div>
          ))}
          <ScrollBar className="bg-foreground/30" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default UserTransactionsList;
