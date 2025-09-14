"use server";

import { sendEmail } from "./email";
import { decode } from "html-entities";
import prisma from "@/lib/prisma";
import {
  cWhatToSelectFromTransaction,
  tBankaccount,
  tTransaction,
  tUser,
} from "@/lib/prisma-types";
import { loadUserByUsernameOrEmail } from "./users";
import { generateUUID, json, renderDateInfo, validEmail } from "@/lib/util";
import { tEmail } from "./data/email-data";
import { TransactionStatus } from "@/generated/prisma";
import { updateAccountAmount } from "./account";

const createTheTransaction = async (
  _transactionID: string,
  _status: TransactionStatus,
  _statusmessage: string,
  _isbanktransaction: boolean,
  _senderAmount: number,
  _receiverAmount: number | null,
  _senderAccountAmount: number,
  _receiverAccountAmount: number | null,
  _senderAccountId: number,
  _receiverAccountId: number | null,
  _sender: string,
  _receiver: string,
  _message: string | null
): Promise<void> => {
  await prisma.transaction.create({
    data: {
      transactionid: _transactionID,
      status: _status,
      statusMessage: _statusmessage,
      isBankTransaction: _isbanktransaction,
      senderAmount: _senderAmount,
      receiverAmount: _receiverAmount,
      senderAccountAmount: _senderAccountAmount,
      receiverAccountAmount: _receiverAccountAmount,
      senderAccountId: _senderAccountId,
      receiverAccountId: _receiverAccountId,
      sender: _sender,
      receiver: _receiver,
      message: _message,
    },
  });
};

const isLinkedBankOfUser = (sender: tUser, _to: string): boolean => {
  let isLinkedBank: boolean = false;
  if (sender && sender.account && sender.account.bankaccounts.length > 0) {
    if (
      sender.account.bankaccounts.some(
        (_bankaccount: tBankaccount) => _bankaccount.IBAN === _to
      )
    ) {
      isLinkedBank = true;
    }
  }

  return isLinkedBank;
};

export const executePayment = async (
  _from: string,
  _to: string,
  _amount: number,
  _message?: string
): Promise<string> => {
  console.log("EXECUTE PAYMENT", _from, _to);

  let paymentOutcome: string = "";

  const transactionID: string = generateUUID();
  let status: TransactionStatus = TransactionStatus.PENDING;
  let statusmessage: string = "";
  let isBankTransaction: boolean = false;
  let senderAmount: number = _amount;
  let receiverAmount: number | null = null;
  let senderAccountAmount: number = 0;
  let receiverAccountAmount: number | null = null;
  let senderAccountId: number = 0;
  let receiverAccountId: number | null = null;
  let sender: string = "";
  let receiver: string = "";
  let message: string = _message ?? "";

  const email: tEmail = {
    destination: undefined,
    template: "",
    params: {},
    asHTML: true,
  };

  let createTransaction: boolean = false;

  const senderEntity: tUser | null = await loadUserByUsernameOrEmail(_from);
  if (senderEntity) {
    sender = senderEntity.email;
    isBankTransaction = isLinkedBankOfUser(senderEntity, _to);
    if (senderEntity.account) {
      senderAccountId = senderEntity.account.id;
      senderAccountAmount = senderEntity.account.amount;
      if (_amount > senderEntity.account.amount) {
        // CASE A
        status = TransactionStatus.REJECTED;
        statusmessage = "Account amount not sufficient";
        paymentOutcome =
          "Payment REJECTED: Sender has insufficient amount on its account";
        createTransaction = true;

        email.destination = senderEntity.email;
        email.template = "TRANSACTION_AMOUNT_INSUFFICIENT";
        email.params = { sender: _from, receiver: _to };
      } else {
        // [TODO] SUPPOSE WE ENTER A BANK ACCOUNT BUT IT IS WRONG OR INVALID ????
        // isBankTransaction = isLinkedBankOfUser(senderEntity, _to);
        if (isBankTransaction) {
          // CASE B
          status = TransactionStatus.COMPLETED;
          statusmessage = "Bank transaction is OK";
          paymentOutcome = "Bank transaction done";
          createTransaction = true;

          const currencySender: string =
            senderEntity.address?.country?.currencycode!;

          receiver = _to;
          receiverAmount = senderAmount;
          email.destination = sender;
          email.template = "EMAIL_PAYMENT_TO_BANK";
          email.params = {
            sender: sender,
            sendercurrency: currencySender,
            amount: `${senderAmount}`,
            bank: receiver,
          };
        } else {
          const receiverEntity: tUser | null = await loadUserByUsernameOrEmail(
            _to
          );
          if (receiverEntity) {
            receiver = receiverEntity.email;
            if (receiverEntity.account) {
              // CASE E
              createTransaction = true;

              status = TransactionStatus.COMPLETED;
              statusmessage = "Client transaction is OK";
              paymentOutcome = "Client transaction done";
              receiverAccountId = receiverEntity.account.id;
              receiverAccountAmount = receiverEntity.account.amount;

              const currencySender: string =
                senderEntity.address?.country?.currencycode!;
              const currencyReceiver: string =
                receiverEntity.address?.country?.currencycode!;

              if (currencySender === currencyReceiver) {
                receiverAmount = senderAmount;
              } else {
                await fetch(
                  `https://v6.exchangerate-api.com/v6/${process.env.CURRENCY_API_KEY}/pair/${currencySender}/${currencyReceiver}/${_amount}`
                )
                  .then((response: Response) => response.json())
                  .then(
                    (value: any) => (receiverAmount = value.conversion_result)
                  );
              }

              email.destination = receiver;
              email.cc = sender;

              if (_message) {
                email.template = "EMAIL_WITH_TRANSACTION_MESSAGE";
                email.params.sendermessage = _message;
              } else {
                email.template = "EMAIL_WITH_TRANSACTION_NO_MESSAGE";
              }

              const currencySenderSymbol: string = decode(
                senderEntity.address?.country?.symbol!
              );

              email.params = {
                receiverfirstname: receiverEntity.firstname,
                receiverlastname: receiverEntity.lastname,
                senderfirstname: senderEntity.firstname,
                senderlastname: senderEntity.lastname,
                senderamount: _amount.toFixed(2),
                sendercurrencysymbol: currencySenderSymbol,
                sendercurrencycode: currencySender,
                transactionid: transactionID,
                transactiondate: renderDateInfo(new Date().toString()),
                transactiondirection: "received",
              };
            } else {
              createTransaction = true;
              // CASE D
              status = TransactionStatus.REJECTED;
              statusmessage = "Receiver is a client but has no account";
              paymentOutcome = "Payment REJECTED: Receiver has no account";
              email.destination = sender;
              email.cc = receiver;
              email.template = "TRANSACTION_PARTY_WITHOUT_ACCOUNT";
              email.params = { sender: _from, party: _to };
            }
          } else {
            // CASE C
            createTransaction = true;
            status = TransactionStatus.REJECTED;
            statusmessage = "Receiver is not a client of Europay";
            paymentOutcome = "Payment REJECTED: Receiver is no client";
            email.destination = sender;
            email.template = "TRANSACTION_UNKNOWN_PARTY";
            email.params = { sender: _from, party: _to };
          }
        }
      }
    } else {
      createTransaction = false;
      paymentOutcome = "Payment IGNORED: Sender has no account in Europay";

      email.destination = sender;
      email.template = "TRANSACTION_PARTY_WITHOUT_ACCOUNT";
      email.params = { sender: _from, party: _from };
    }
  } else {
    paymentOutcome = "Payment IGNORED: Sender not a client of Europay";
    createTransaction = false;

    if (validEmail(_to)) {
      email.destination = _to;
      email.template = "TRANSACTION_UNKNOWN_PARTY";
      email.params = { sender: _to, party: _to };
    }
  }

  if (createTransaction) {
    await createTheTransaction(
      transactionID,
      status,
      statusmessage,
      isBankTransaction,
      senderAmount,
      receiverAmount,
      senderAccountAmount,
      receiverAccountAmount,
      senderAccountId,
      receiverAccountId,
      _from,
      _to,
      message
    );

    if (senderAccountId && status === TransactionStatus.COMPLETED) {
      updateAccountAmount(senderAccountId, -senderAmount);
    }

    if (receiverAccountId && status === TransactionStatus.COMPLETED) {
      updateAccountAmount(receiverAccountId, receiverAmount ?? 0);
    }
  }

  if (email.destination) {
    await sendEmail(email);
  }

  return paymentOutcome;
};

// Preivously loadAllTransactions
export const loadTransactions = async (): Promise<tTransaction[]> => {
  let result: tTransaction[] = [];

  await prisma.transaction
    .findMany({
      orderBy: {
        createDate: "desc",
      },
      ...cWhatToSelectFromTransaction,
    })
    .then((values: tTransaction[]) => (result = values));

  return result;
};

export const loadTransactionById = async (
  _id: number
): Promise<tTransaction | null> => {
  let result: tTransaction | null = null;

  await prisma.transaction
    .findFirst({
      where: {
        id: _id,
      },
      ...cWhatToSelectFromTransaction,
    })
    .then((value: tTransaction | null) => (result = value));

  return result;
};

export const loadTransactionsByTransactionId = async (
  _transactionId: string
): Promise<tTransaction[]> => {
  let result: tTransaction[] = [];

  await prisma.transaction
    .findMany({
      where: {
        transactionid: _transactionId,
      },
      ...cWhatToSelectFromTransaction,
    })
    .then((values: tTransaction[]) => (result = values));

  return result;
};

export const loadTransactionByAccountId = async (
  _accountid: number
): Promise<tTransaction[]> => {
  let result: tTransaction[] = [];

  await prisma.transaction
    .findMany({
      where: {
        OR: [
          {
            senderAccountId: _accountid,
          },
          {
            receiverAccountId: _accountid,
          },
        ],
      },
      orderBy: {
        createDate: "desc",
      },
      ...cWhatToSelectFromTransaction,
    })
    .then((values: tTransaction[]) => (result = values));

  return result;
};

export const getNrOfTransactions = async (
  _accountId: number
): Promise<number> => {
  let result: number = 0;

  await prisma.transaction
    .count({
      where: {
        OR: [
          {
            senderAccountId: _accountId,
          },
          {
            receiverAccountId: _accountId,
          },
        ],
      },
    })
    .then((value: number) => (result = value));

  return result;
};

export const getCompletedTransactionsByDates = async (
  _accountId: number,
  _firstDay: Date,
  _lastDay: Date
): Promise<any[]> => {
  let result: any[] = [];

  await prisma.transaction
    .findMany({
      where: {
        AND: [
          {
            status: TransactionStatus.COMPLETED,
          },
          {
            OR: [
              {
                receiverAccountId: _accountId,
              },
              {
                senderAccountId: _accountId,
              },
            ],
          },
        ],
        createDate: {
          gte: _firstDay,
          lte: _lastDay,
        },
      },
      orderBy: {
        createDate: "asc",
      },
      ...cWhatToSelectFromTransaction,
    })
    .then((values: tTransaction[]) => {
      result = values;
    });

  return result;
};
