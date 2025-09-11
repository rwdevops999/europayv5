import React from "react";
import TransactionsListWithSuspense from "./transactions-list-with-suspense";
import { tTransaction } from "@/lib/prisma-types";
import { loadTransactions } from "@/app/server/transaction";

export const dynamic = "force-dynamic";

const TransactionsPage = async () => {
  const transactions: tTransaction[] = await loadTransactions();

  return <TransactionsListWithSuspense transactions={transactions} />;
};

export default TransactionsPage;
