"use client";

import { useEffect } from "react";
import TransactionForm from "./transaction-form";
import Dialog from "@/ui/dialog";

const TransactionViewer = ({
  transactionId,
}: {
  transactionId: number | undefined;
}) => {
  const openDialog = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "transactiondialog"
    ) as HTMLDialogElement;

    dialog.showModal();
  };

  useEffect(() => {
    openDialog();
  }, [transactionId]);

  return (
    <Dialog
      title=""
      id="transactiondialog"
      form={<TransactionForm transactionId={transactionId} />}
      className="w-6/12 max-w-6xl border-1 border-base-content/40"
    />
  );
};

export default TransactionViewer;
