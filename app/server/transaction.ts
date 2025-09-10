import { tTransaction, tUser } from "@/lib/prisma-types";
import { generateUUID, validEmail } from "@/lib/util";
import { TransactionStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { tEmail } from "./data/email-data";
import { loadUserByUsernameOrEmail } from "./users";
import { sendEmail } from "./email";
import { updateAccountAmount } from "./account";

const createTransactionDetail = async (
  _uuid: string,
  _party: string,
  _partyAccountAmount: number,
  _partyAmount: number,
  _isBankTransaction: boolean,
  _transactionDate: Date
): Promise<void> => {
  await prisma.transactionDetail.create({
    data: {
      transactionid: _uuid,
      party: _party,
      partyAccountAmount: _partyAccountAmount,
      partyAmount: _partyAmount,
      isBankTransaction: _isBankTransaction,
      transactionDate: _transactionDate,
    },
  });
};

// const createTransaction = async (
//   _transactionID: string,

//   _from: string,
//   _to: string,
//   _amount: number,
//   _message: string | null,
//   _status: TransactionStatus,

//   _senderAccountId: number,
//   _senderAccountAmount: number,

//   _statusMessage: string = "",

//   _receiverId: number | null = null,
//   _receiverAmount: number = 0
// ): Promise<void> => {
//   await prisma.transaction.create({
//     data: {
//       transactionid: _transactionID,
//       sender: _from,
//       receiver: _to,
//       amount: _amount,

//       message: _message,

//       status: _status,
//       statusmessage: _statusMessage,

//       senderAccountId: _senderAccountId,
//       senderAccountAmount: _senderAccountAmount,

//       receiverAmount: _receiverAmount ?? _amount,
//       receiverId: _receiverId,
//     },
//   });
// };

const createIncomingTransaction = async (
  _transactionID: string,
  _from: string,
  _to: string,
  _amount: number,
  _message?: string
): Promise<number> => {
  let result: number = 0;

  await prisma.transaction
    .create({
      data: {
        transactionid: _transactionID,
        sender: _from,
        receiver: _to,
        amount: _amount,
        message: _message,
      },
    })
    .then((transaction: tTransaction) => {
      result = transaction.id;
    });

  return result;
};

const updateTransactionStatus = async (
  _id: number,
  _status: TransactionStatus,
  _statusmessage: string,
  _parties: number[]
): Promise<void> => {
  await prisma.transaction.update({
    where: {
      id: _id,
    },
    data: {
      status: _status,
      statusMessage: _statusmessage,
      parties: _parties,
    },
  });
};

const findTransactionById = async (
  _transactionID: number
): Promise<tTransaction | null> => {
  let result: tTransaction | null = null;

  await prisma.transaction
    .findFirst({
      where: {
        id: _transactionID,
      },
    })
    .then((transaction: tTransaction | null) => (result = transaction));

  return result;
};

export const handlePayment = async (
  _transactionId: number,
  _from: string,
  _to: string,
  _amount: number
): Promise<string> => {
  let status: TransactionStatus;
  let statusmessage: string = "";

  const sender: tUser | null = await loadUserByUsernameOrEmail(_from);

  const email: tEmail = {
    destination: undefined,
    template: "",
    params: {},
    asHTML: true,
  };

  let amountToPay: number = _amount;
  let isBankAccount: boolean = false;
  let executePayment: boolean = false;

  let currencySender: string = "";
  let currencyReceiver: string = "";

  let senderEmail: string = "";
  let senderAccountId: number = 0;
  let senderAccountAmount: number = 0;

  let receiverEmail: string = "";
  let receiverAccountId: number = 0;
  let receiverAccountAmount: number = 0;

  let receiver: tUser | null = null;

  if (sender && sender.account) {
    senderEmail = sender.email;
    senderAccountId = sender.account.id;
    senderAccountAmount = sender.account.amount;
    if (sender.account.amount >= _amount) {
      currencySender = sender.address?.country?.currencycode!;

      // let bankId: number|undefined = getLinkedBankIdOfUser(sender, _to);
      if (isBankAccount) {
        currencyReceiver = currencySender;
        receiverEmail = _to;
        receiverAccountId = 0;
        receiverAccountAmount = 0;

        // _to is a bank account
        status = TransactionStatus.COMPLETED;
        statusmessage = "Bank payment";
        executePayment = true;
      } else {
        // _to is an email or username
        receiver = await loadUserByUsernameOrEmail(_to);
        if (receiver && receiver.account) {
          receiverEmail = receiver.email;
          receiverAccountId = receiver.account.id;
          receiverAccountAmount = receiver.account.amount;

          currencyReceiver = receiver.address?.country?.currencycode!;

          status = TransactionStatus.COMPLETED;
          statusmessage = "Client payment";
          executePayment = true;
        } else {
          status = TransactionStatus.REJECTED;
          statusmessage = "Receiver invalid";

          email.destination = _from;
          email.template = "TRANSACTION_INVALID_PARTY";
          email.params = {
            sender: _from,
            party: _to,
            url: "http://localhost:3000",
          };
        }
      }
    } else {
      status = TransactionStatus.REJECTED;
      statusmessage = "Amount insufficient";

      email.destination = _from;
      email.template = "AMOUNT_INSUFFICIENT";
      email.params = { sender: _from, receiver: _to };
    }
  } else {
    // if (validEmail(_from)) {
    status = TransactionStatus.REJECTED;
    statusmessage = "Sender invalid";

    email.destination = _from;
    email.template = "TRANSACTION_INVALID_PARTY";
    email.params = {
      sender: _from,
      party: _from,
      url: "http://localhost:3000",
    };
  }

  const transaction: tTransaction | null = await findTransactionById(
    _transactionId
  );

  if (executePayment) {
    let amountPayableToReceiver: number = 0;
    await fetch(
      `https://v6.exchangerate-api.com/v6/${process.env.CURRENCY_API_KEY}/pair/${currencySender}/${currencyReceiver}/${amountToPay}`
    )
      .then((response: Response) => response.json())
      .then(
        (value: any) => (amountPayableToReceiver = value.conversion_result)
      );

    if (transaction?.status === TransactionStatus.PENDING) {
      await updateAccountAmount(senderAccountId, -amountToPay)
        .then(async () => {
          await createTransactionDetail(
            transaction.transactionid,
            senderEmail,
            senderAccountAmount,
            amountToPay,
            isBankAccount,
            transaction.transactionDate ?? new Date()
          );
        })
        .then(async () => {
          if (!isBankAccount) {
            await updateAccountAmount(
              receiverAccountId,
              amountPayableToReceiver
            );
          }
        })
        .then(async () => {
          await createTransactionDetail(
            transaction.transactionid,
            receiverEmail,
            receiverAccountAmount,
            amountPayableToReceiver,
            isBankAccount,
            transaction.transactionDate ?? new Date()
          );
        })
        .then(async () => {
          let parties: number[] = [];

          parties[0] = sender ? sender.id : 0;
          parties[1] = receiver ? receiver.id : 0;

          await updateTransactionStatus(
            transaction.id,
            status,
            statusmessage,
            parties
          );
        })
        .then(async () => {
          console.log("SEND EMAIL");
          console.log("SEND EMAIL FOR COMPLETED TRANSACTION");
        });
    }
  } else {
    if (transaction?.status === TransactionStatus.PENDING) {
      let parties: number[] = [];

      parties[0] = sender ? sender.id : 0;
      parties[1] = receiver ? receiver.id : 0;

      await updateTransactionStatus(
        transaction.id,
        status,
        statusmessage,
        parties
      ).then(() => {
        console.log("SEND EMAIL FOR REJECTED TRANSACTION");
      });
    }
  }

  return statusmessage;
};

export const executePayment = async (
  _from: string,
  _to: string,
  _amount: number,
  _message?: string
): Promise<string> => {
  const transactionID: string = generateUUID();

  const tid: number = await createIncomingTransaction(
    transactionID,
    _from,
    _to,
    _amount,
    _message
  );

  const statusmessage: string = await handlePayment(tid, _from, _to, _amount);

  // if (email.destination) {
  //   await sendEmail(email);
  // }

  return statusmessage;
};

// senderId = sender.id;
// senderAccountAmount = sender.account?.amount;

// // let bankId: number|undefined = getLinkedBankIdOfUser(sender, _to);
// // isTransferToBank = isLinkedBankOfUser(sender, _to);

//  email.destination = sender.email;

// has sender enough on his account ?
// if (sender.account) {
// } else {

// }

// if (sender) {
//   isTransferToBank = isLinkedBankOfUser(sender, _to);
// }

// if (sender && isTransferToBank) {
// if (sender && isTransferToBank) {
// } else {
//   if (sender) {
//     let senderAvailableAmount: number = 0;
//     if (receiver) {
//       if (sender.account) {
//         senderAvailableAmount = sender.account.amount;
//       }

//       if (senderAvailableAmount < _amount) {
//       } else {
//         const _currencySender: string =
//           sender.address?.country?.currencycode!;
//         const _currencySenderSymbol: string = decode(
//           sender.address?.country?.symbol!
//         );
//         const _currencyReceiver: string =
//           receiver.address?.country?.currencycode!;

//         let amountPayableToReceiver: number = 0;
//         await fetch(
//           `https://v6.exchangerate-api.com/v6/${process.env.CURRENCY_API_KEY}/pair/${_currencySender}/${_currencyReceiver}/${_amount}`
//         )
//           .then((response: Response) => response.json())
//           .then(
//             (value: any) =>
//               (amountPayableToReceiver = value.conversion_result)
//           );

//         const transactionID: string = generateUUID();
//         createTransaction(
//           transactionID,
//           _from,
//           sender.account?.id,
//           sender.account?.amount,
//           _amount,
//           _message ?? null,
//           _to,
//           receiver.account?.id,
//           receiver.account?.amount,
//           amountPayableToReceiver
//         );

//         await removePayment(sender.account?.id, _amount, _to, transactionID);
//         await addPayment(
//           receiver.account?.id,
//           amountPayableToReceiver,
//           _from,
//           transactionID
//         );

//         email.destination = receiver.email;
//         email.cc = sender.email;

//         // "parameters": "{receiverfirstname, receiverlastname, senderfirstname, senderlastname, senderamount, sendercurrencysymbol, sendercurrencycode, sendermessage, transactionid, transactiondate, transactiondirection}",
//         const transactionDate: Date = new Date();

//         email.params = {
//           receiverfirstname: receiver.firstname,
//           receiverlastname: receiver.lastname,
//           senderfirstname: sender.firstname,
//           senderlastname: sender.lastname,
//           senderamount: _amount.toFixed(2),
//           sendercurrencysymbol: _currencySenderSymbol,
//           sendercurrencycode: _currencySender,
//           transactionid: transactionID,
//           transactiondate: renderDateInfo(transactionDate.toString()),
//           transactiondirection: "received",
//         };

//         if (_message) {
//           email.template = "EMAIL_WITH_TRANSACTION_MESSAGE";
//           email.params.sendermessage = _message;
//         } else {
//           email.template = "EMAIL_WITH_TRANSACTION_NO_MESSAGE";
//         }

//         paymentoutcome = "Payment OK";
//       }
//     } else {
//       paymentoutcome += ": receiver unknown in Europay";
//       email.destination = sender.email;
//     }
//   } else {
//     paymentoutcome += ": sender unknown in Europay";
//   }

//   if (email.destination) {
//     await sendEmail(email);
//   }
// }

// revalidatePath(absoluteUrl("/user"));
// };

export const countTransactions = async (_userid: number): Promise<number> => {
  let result: number = 0;

  console.log("[TRANSACTION]:countTransaction for", _userid);
  await prisma.transaction
    .count({
      where: {
        AND: [
          {
            parties: {
              has: _userid,
            },
          },
          {
            OR: [
              {
                status: TransactionStatus.PENDING,
              },
              {
                status: TransactionStatus.COMPLETED,
              },
              {
                status: TransactionStatus.REJECTED,
              },
            ],
          },
        ],
      },
    })
    .then((value: number) => (result = value));

  console.log("[TRANSACTION]:countTransaction result is", result);
  return result;
};
