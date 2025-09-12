"use client";

import { loadUserByEmail, loadUserByUsernameOrEmail } from "@/app/server/users";
import { tTransaction, tUser } from "@/lib/prisma-types";
import { json, renderDateInfo } from "@/lib/util";
import ProgressLink from "@/ui/progress-link";
import clsx from "clsx";
import { decode } from "html-entities";
import { ReactNode, useEffect, useState } from "react";
import {
  PiArrowFatLineLeftDuotone,
  PiArrowFatLineRightDuotone,
} from "react-icons/pi";

type TransactionInfo = {
  transactionId: string;
  transactionDate: Date;
  inbound: boolean;
  counterpart: string;
  amount: string;
  symbol: string;
  currency: string;
};

const TransactionItem = ({
  transaction,
  user,
}: {
  transaction: tTransaction;
  user: tUser | null;
}) => {
  const [info, setInfo] = useState<TransactionInfo>({
    transactionId: "",
    transactionDate: new Date(),
    inbound: true,
    counterpart: "",
    amount: new Number(0).toFixed(2),
    symbol: "",
    currency: "",
  });

  const setupTransactionInfo = async (
    _transaction: tTransaction,
    _user: tUser | null
  ): Promise<void> => {
    if (user) {
      let inbound: boolean = false;
      let transactionAmount: string = new Number(0).toFixed(2);

      const currencySymbol: string = decode(user.address?.country?.symbol);
      let currencyCode: string = user.address?.country?.currencycode!;

      let party: string = "";

      // if (
      //   user.account?.bankaccounts.some(
      //     (_bankaccount: tBankaccount) =>
      //       _bankaccount.IBAN === transaction.receiver
      //   )
      // ) {
      //   party = transaction.receiver!;
      //   transactionAmount = transaction.receiverAmount.toFixed(2);
      // } else {

      if (
        user.email === transaction.receiver ||
        user.username === transaction.receiver
      ) {
        inbound = true;
        transactionAmount = transaction.receiverAmount?.toFixed(2)!;
        const counterParty: tUser | null = await loadUserByUsernameOrEmail(
          transaction.sender!
        );
        if (counterParty) {
          party = `${counterParty.firstname} ${counterParty.lastname}`;
        }
      } else {
        inbound = false;
        transactionAmount = transaction.senderAmount.toFixed(2);
        const counterParty: tUser | null = await loadUserByUsernameOrEmail(
          transaction.receiver!
        );

        if (counterParty) {
          party = `${counterParty.firstname} ${counterParty.lastname}`;
        }
      }
      // }

      const transactionInfo: TransactionInfo = {
        transactionId: _transaction.transactionid,
        transactionDate: _transaction.createDate!,
        inbound: inbound,
        counterpart: party,
        amount: transactionAmount,
        symbol: currencySymbol,
        currency: currencyCode,
      };

      setInfo(transactionInfo);
    }
  };

  useEffect(() => {
    setupTransactionInfo(transaction, user);
  }, [transaction]);

  const renderLink = (
    _id: number,
    _str: string
    // _user: tUser,
  ): ReactNode => {
    // const uselink: boolean = _user && $iam_user(_iamactions, _user);
    const uselink: boolean = true;
    return (
      <>
        {uselink && (
          <div className="ml-3 flex items-center h-[8px]">
            <div className="underline text-blue-400">
              <ProgressLink href={`/transactions/id=${_id}`}>
                {_str}
              </ProgressLink>
            </div>
          </div>
        )}
      </>
    );
  };

  const RenderTransactionInfo = (): ReactNode => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label>id:</label>
          {renderLink(transaction.id, transaction.transactionid)}
        </div>
        <div>
          <label>{renderDateInfo(info.transactionDate.toString())}</label>
        </div>
      </div>
    );
  };

  const RenderParties = () => {
    return (
      <div className="py-3 flex items-center justify-between">
        <div>
          {info.inbound && (
            <div className="flex items-center">
              <PiArrowFatLineLeftDuotone />
              &nbsp;&nbsp;(incoming)
            </div>
          )}
          {!info.inbound && (
            <div className="flex space-x-1 items-center">
              (outgoing)&nbsp;&nbsp;
              <PiArrowFatLineRightDuotone />
            </div>
          )}
        </div>
        <div>
          {info.inbound && (
            <div className="flex items-center">
              <label>from:</label>
              <label>{info.counterpart}</label>
            </div>
          )}
          {!info.inbound && (
            <div className="flex items-center">
              <label>to:</label>
              <label>{info.counterpart}</label>
            </div>
          )}
        </div>
      </div>
    );
  };

  const RenderAmount = () => {
    return (
      <div className="flex space-x-1">
        <label>amount:</label>
        <label>{info.amount}</label>
        <label>{info.symbol}</label>
        <label>{info.currency}</label>
      </div>
    );
  };

  return (
    <div
      className={clsx(
        "mt-1 p-1 border-1 width-[50%]",
        { "border-success": info.inbound },
        { "border-error": !info.inbound }
      )}
    >
      <RenderTransactionInfo />
      <RenderParties />
      <RenderAmount />
    </div>
  );
};

export default TransactionItem;
