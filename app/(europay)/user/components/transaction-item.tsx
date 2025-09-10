"use client";

import { loadTransactionDetails } from "@/app/server/transaction";
import { tTransaction, tTransactionDetail, tUser } from "@/lib/prisma-types";
import { json, renderDateInfo } from "@/lib/util";
import ProgressLink from "@/ui/progress-link";
import clsx from "clsx";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import {
  PiArrowFatLineLeftDuotone,
  PiArrowFatLineRightDuotone,
} from "react-icons/pi";
import ReactHtmlParser from "react-html-parser";

type TransactionInfo = {
  transactionId: string;
  transactionDate: Date;
  inbound: boolean;
  counterpart: string;
  amount: string;
  symbol: ReactElement;
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
    symbol: <></>,
    currency: "",
  });

  const setupTransactionInfo = async (
    _transaction: tTransaction,
    _user: tUser | null
  ): Promise<void> => {
    if (_user) {
      console.log(
        "Processing transaction:",
        _transaction.id,
        _transaction.transactionid
      );

      const transactionInfo: TransactionInfo = {
        transactionId: _transaction.transactionid,
        transactionDate: _transaction.transactionDate,
        inbound: false,
        counterpart: "",
        amount: "",
        symbol: <></>,
        currency: "",
      };

      if (
        _transaction.receiver === _user.username ||
        _transaction.receiver === _user.email
      ) {
        transactionInfo.inbound = true;
        transactionInfo.counterpart = transaction.sender;
      } else {
        transactionInfo.inbound = false;
        transactionInfo.counterpart = transaction.receiver;
      }

      const transactiondetails: tTransactionDetail[] =
        await loadTransactionDetails(_transaction.transactionid);

      const userTransactionDetail: tTransactionDetail | undefined =
        transactiondetails.find(
          (detail: tTransactionDetail) => detail.party === _user?.email
        );

      if (userTransactionDetail) {
        const currencySymbol: ReactElement[] = ReactHtmlParser(
          _user.address?.country?.symbol!
        );
        let currencyCode: string = _user.address?.country?.currencycode!;

        transactionInfo.currency = currencyCode;
        transactionInfo.symbol = currencySymbol[0];
        transactionInfo.amount = userTransactionDetail.partyAmount.toString();
      }

      console.log("TRANSACTION INFO", json(transactionInfo));
      setInfo(transactionInfo);
    }
  };

  useEffect(() => {
    console.log(
      "[TransactionItem]:UE[transaction] Handle transaction",
      json(transaction)
    );
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
