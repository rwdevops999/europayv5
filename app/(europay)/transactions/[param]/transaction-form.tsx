"use client";

import { loadTransactionById } from "@/app/server/transaction";
import { TransactionStatus } from "@/generated/prisma";
import { tTransaction, tUser } from "@/lib/prisma-types";
import { json, renderDateInfo } from "@/lib/util";
import Button from "@/ui/button";
import { Separator } from "@/ui/radix/separator";
import clsx from "clsx";
import { decode } from "html-entities";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  GiTrafficLightsGreen,
  GiTrafficLightsOrange,
  GiTrafficLightsRed,
} from "react-icons/gi";
import { PiArrowFatLineRightDuotone } from "react-icons/pi";

type UserInfo = {
  firstname: string;
  lastname: string;
  avatar: string | null;
  amount: string;
  currencysymbol: string;
  currencycode: string;
};
type BankInfo = {
  IBAN: string;
  avatar: string;
  amount: string;
  currencysymbol: string;
  currencycode: string;
};
type TransactionInfo = {
  transactionId: string;
  transactionDate: Date | null;
  message: string | null;
  status: string;
  statustext: string;
  sender: UserInfo;
  receiver?: UserInfo;
  bank?: BankInfo;
};

const TransactionForm = ({ transactionId = 0 }: { transactionId?: number }) => {
  const { back } = useRouter();

  const isBankTransfer = useRef<boolean>(false);

  const [transactionInfo, setTransactionInfo] = useState<TransactionInfo>({
    transactionId: "",
    transactionDate: new Date(),
    message: null,
    status: "COMPLETED",
    statustext: "",
    sender: {
      firstname: "",
      lastname: "",
      avatar: "john.doe.png",
      amount: "0.00",
      currencysymbol: "",
      currencycode: "",
    },
    receiver: {
      firstname: "",
      lastname: "",
      avatar: "john.doe.png",
      amount: "0.00",
      currencysymbol: "",
      currencycode: "",
    },
  });

  const loadTheTransactions = async (_transactionId: number): Promise<void> => {
    const transaction: tTransaction | null = await loadTransactionById(
      _transactionId
    );

    if (transaction) {
      console.log("[LOADED TRANSACTION]", json(transaction));
      let tsender: tUser = transaction.senderAccount?.user as tUser;
      let treceiver: tUser = transaction.receiverAccount?.user as tUser;

      const isBank: boolean = transaction.isBankTransaction;
      isBankTransfer.current = isBank;

      console.log("RECEIVER", json(treceiver));

      const trInfo: TransactionInfo = {
        transactionId: transaction.transactionid,
        transactionDate: transaction.createDate,
        message: null,
        status: transaction.status,
        statustext: transaction.statusMessage,
        sender: {
          firstname: tsender.firstname,
          lastname: tsender.lastname,
          avatar: tsender.avatar === "" ? "john.doe.png" : tsender.avatar,
          amount: transaction.senderAmount.toString(),
          currencysymbol: decode(tsender.address?.country?.symbol),
          currencycode: tsender.address?.country?.currencycode ?? "",
        },
        receiver: {
          firstname: isBank
            ? "Bank"
            : treceiver
            ? treceiver.firstname
            : transaction.receiver ?? "",
          lastname: isBank
            ? `(${transaction.receiver})`
            : treceiver
            ? treceiver.lastname
            : "",
          avatar: isBank ? "bank.png" : "john.doe.png",
          amount: transaction.receiverAmount
            ? transaction.receiverAmount.toString()
            : "0.00",
          currencysymbol: isBank
            ? decode(tsender.address?.country?.symbol)
            : treceiver?.address?.country
            ? decode(treceiver?.address?.country?.symbol)
            : "",
          currencycode: isBank
            ? tsender.address?.country?.currencycode ?? ""
            : treceiver?.address?.country
            ? treceiver?.address?.country?.currencycode ?? ""
            : "",
        },
      };

      console.log("[TRINFO]", json(trInfo));

      setTransactionInfo(trInfo);
    }

    // if (transaction) {
    //   let tsender: tUser = transaction.senderAccount?.user as tUser;

    //   // if (
    //   //   tsender.account?.bankaccounts.some(
    //   //     (_bankaccount: tBankaccount) =>
    //   //       _bankaccount.IBAN === transaction.receiver
    //   //   )
    //   // ) {
    //   //   const bankaccount: tBankaccount | null = await loadBankAccountByIBAN(
    //   //     transaction.receiver!
    //   //   );

    //   //   if (bankaccount) {
    //   //     const trInfo: TransactionInfo = {
    //   //       transactionId: transaction.transactionid,
    //   //       transactionDate: transaction.createDate!,
    //   //       message: transaction.message,
    //   //       sender: {
    //   //         firstname: tsender.firstname,
    //   //         lastname: tsender.lastname,
    //   //         avatar: tsender.avatar,
    //   //         amount: transaction.senderAmount.toFixed(2),
    //   //         currencycode: tsender.address?.country?.currencycode!,
    //   //         currencysymbol: decode(tsender.address?.country?.symbol),
    //   //       },
    //   //       bank: {
    //   //         IBAN: bankaccount.IBAN,
    //   //         avatar: "bank.png",
    //   //         amount: transaction.receiverAmount.toFixed(2),
    //   //         currencysymbol: decode(tsender.address?.country?.symbol),
    //   //         currencycode: tsender.address?.country?.currencycode!,
    //   //       },
    //   //     };

    //   //     setTransactionInfo(trInfo);
    //   //   }
    //   // } else {
    //   let treceiver: tUser = transaction.receiverAccount?.user as tUser;

    //   const trInfo: TransactionInfo = {
    //     transactionId: transaction.transactionid,
    //     transactionDate: transaction.createDate!,
    //     message: transaction.message,
    //     sender: {
    //       firstname: tsender.firstname,
    //       lastname: tsender.lastname,
    //       avatar: tsender.avatar,
    //       amount: transaction.senderAmount.toFixed(2),
    //       currencycode: tsender.address?.country?.currencycode!,
    //       currencysymbol: decode(tsender.address?.country?.symbol),
    //     },
    //     receiver: {
    //       firstname: treceiver.firstname,
    //       lastname: treceiver.lastname,
    //       avatar: treceiver.avatar!,
    //       amount: transaction.receiverAmount
    //         ? transaction.receiverAmount.toFixed(2)
    //         : "0.00",
    //       currencysymbol: decode(treceiver.address?.country?.symbol),
    //       currencycode: treceiver.address?.country?.currencycode!,
    //     },
    //   };

    // setTransactionInfo(trInfo);
    // }
    // }
  };

  useEffect(() => {
    loadTheTransactions(transactionId);
  }, [transactionId]);

  const TransactionHeader = () => {
    return (
      <>
        <div className="flex items-center justify-between text-sm font-bold">
          <div className="items-start">
            <label>Transaction ID:</label>
          </div>
          <div className="items-end">
            <label>Transaction date:</label>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="items-start">
            <label>{transactionInfo?.transactionId}</label>
          </div>
          <div className="items-end">
            <label>
              {transactionInfo &&
                renderDateInfo(transactionInfo?.transactionDate?.toString()!)}
            </label>
          </div>
        </div>
      </>
    );
  };

  const TransactionContent = () => {
    return (
      <>
        <div className="my-5 flex items-center justify-between">
          <div className="flex items-center">
            <div className="space-x-2">
              <div className="avatar">
                <div className="w-8 rounded-full hover:cursor-pointer">
                  <img
                    id="avatarsender"
                    src={`/avatars/${transactionInfo?.sender.avatar}`}
                    alt="sender"
                  />
                </div>
              </div>
              <label className="text-sm">
                {transactionInfo?.sender.firstname}&nbsp;
                {transactionInfo?.sender.lastname}
              </label>
            </div>
          </div>
          <div>
            <PiArrowFatLineRightDuotone />
          </div>
          <div>
            {transactionInfo.receiver && (
              <div className="flex items-center space-x-2">
                <label className="text-sm">
                  {transactionInfo?.receiver.firstname}&nbsp;
                  {transactionInfo?.receiver.lastname}
                </label>
                <div className="avatar">
                  <div
                    className={clsx(
                      "w-8",
                      { "": isBankTransfer.current },
                      { "rounded-full": !isBankTransfer.current }
                    )}
                  >
                    <img
                      id="avatarreceiver"
                      src={`/avatars/${transactionInfo?.receiver.avatar}`}
                      alt="receiver"
                    />
                  </div>
                </div>
              </div>
            )}
            {transactionInfo.bank && (
              <div className="flex items-center space-x-2">
                <div className="avatar">
                  <div className="w-6">
                    <img
                      id="avatarbank"
                      src={`/avatars/${transactionInfo?.bank.avatar}`}
                      alt="bank"
                    />
                  </div>
                </div>
                <label className="text-sm">{transactionInfo?.bank.IBAN}</label>
              </div>
            )}
          </div>
        </div>
        {transactionInfo.message && (
          <div className="mt-5 flex flex-col mb-5">
            <label className="text-sm">
              Note from {transactionInfo.sender.firstname}{" "}
              {transactionInfo.sender.lastname}:
            </label>
            <label className="text-xl font-bold break-words">
              "{transactionInfo.message}"
            </label>
          </div>
        )}
      </>
    );
  };

  const TransactionAmount = () => {
    return (
      <div className="py-4 flex items-center justify-between">
        <div className="space-x-2">
          <label className="text-sm font-bold">Money sent</label>
          <div className="flex space-x-2 text-sm">
            <div>{transactionInfo?.sender.amount}</div>
            <div>{transactionInfo?.sender.currencysymbol}</div>
            <div>{transactionInfo?.sender.currencycode}.</div>
          </div>
        </div>
        <div className="space-x-2">
          <label className="text-sm font-bold">Money received</label>
          {transactionInfo.receiver && (
            <div className="flex space-x-2 text-sm">
              <div>{transactionInfo?.receiver.amount}</div>
              <div>{transactionInfo?.receiver.currencysymbol}</div>
              <div>{transactionInfo?.receiver.currencycode}.</div>
            </div>
          )}
          {transactionInfo.bank && (
            <div className="flex space-x-2 text-sm">
              <div>{transactionInfo?.bank.amount}</div>
              <div>{transactionInfo?.bank.currencysymbol}</div>
              <div>{transactionInfo?.bank.currencycode}.</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const TransactionStatus = () => {
    return (
      <div className="pt-4 flex items-center justify-between">
        <div>
          {transactionInfo.status === "PENDING" && (
            <div className="flex items-center text-orange-500">
              <GiTrafficLightsOrange />
              <label>PENDING</label>
            </div>
          )}
          {transactionInfo.status === "REJECTED" && (
            <div className="flex items-center text-red-500">
              <GiTrafficLightsRed />
              <label>REJECTED</label>
            </div>
          )}
          {transactionInfo.status === "COMPLETED" && (
            <div className="flex items-center text-green-500">
              <GiTrafficLightsGreen />
              <label>COMPLETED</label>
            </div>
          )}
        </div>
        <div>{transactionInfo.statustext}</div>
      </div>
    );
  };

  const Content = () => {
    return (
      <div className="min-w-[100%] h-[100%]">
        <TransactionHeader />
        <Separator />
        <TransactionContent />
        <Separator />
        <TransactionAmount />
        <Separator />
        <TransactionStatus />
      </div>
    );
  };

  const handleCloseClick = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "transactiondialog"
    ) as HTMLDialogElement;

    dialog.close();
    back();
  };

  const Buttons = () => {
    return (
      <div className="flex flex-col">
        <Button
          name="Close"
          intent={"neutral"}
          style={"soft"}
          size={"small"}
          onClick={handleCloseClick}
          className="bg-custom"
          type="button"
        />
      </div>
    );
  };

  return (
    <div>
      <div className="relative w-[100%] flex justify-between">
        <div className="w-[85%]">
          <Content />
        </div>
        <div className="w-[13%] flex justify-end">
          <Buttons />
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
