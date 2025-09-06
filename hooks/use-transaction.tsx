"use client";

import { createContext, ReactNode, useContext, useRef, useState } from "react";

interface TransactionContextInterface {
  transactionAvailable: boolean;
  setTransactionAvailable: (value: boolean) => void;
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
  const [transactionAvailable, setTransactionAvailable] =
    useState<boolean>(false);

  return (
    <TransactionContext.Provider
      value={{ transactionAvailable, setTransactionAvailable }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export default {
  TransactionProvider,
  useTransaction,
};
