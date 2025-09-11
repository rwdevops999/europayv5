import { Suspense } from "react";
import TransactionList from "./transaction-list";
import { loadTransactions } from "@/app/server/transaction";
import LoadingSpinner from "@/ui/loading-spinner";
import { tTransaction } from "@/lib/prisma-types";

const TransactionsListLoader = async () => {
  const transactions = await loadTransactions();

  return <TransactionList transactions={transactions} />;
};

const TransactionsListWithSuspense = ({
  transactions,
}: {
  transactions: tTransaction[];
}) => {
  if (transactions) {
    return <TransactionList transactions={transactions} />;
  }

  return (
    <Suspense fallback={<LoadingSpinner label="loading..." />}>
      <TransactionsListLoader />
    </Suspense>
  );
};

export default TransactionsListWithSuspense;
