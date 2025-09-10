"use client";

import { createContext, ReactNode, useContext, useRef, useState } from "react";

interface TransactionContextInterface {
  transactions: number;
  setTransactions: (value: number) => void;
}

const TransactionContext = createContext<
  TransactionContextInterface | undefined
>(undefined);

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
};

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<number>(0);

  return (
    <TransactionContext.Provider value={{ transactions, setTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export default {
  TransactionProvider,
  useTransaction,
};
