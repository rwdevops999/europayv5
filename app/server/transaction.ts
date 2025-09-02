import { tUser } from "@/lib/prisma-types";
import { loadUserWithUsernameOrEmail } from "./users";
import { generateUUID } from "@/lib/util";
import { TransactionStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { tEmail } from "./data/email-data";

const createTransaction = async (
  _transactionID: string,
  _from: string,
  _senderAccountId: number | undefined,
  _senderAccountAmount: number | undefined,
  _senderAmount: number,
  _message: string | null,
  _to: string,
  _receiverAccountId?: number | undefined,
  _receiverAccountAmount?: number | undefined,
  _receiverAmount?: number
): Promise<void> => {
  await prisma.transaction.create({
    data: {
      transactionid: _transactionID,
      createDate: new Date(),
      status: TransactionStatus.PENDING,
      sender: _from,
      senderAmount: _senderAmount,
      senderAccountId: _senderAccountId!,
      senderAccountAmount: _senderAccountAmount!,
      message: _message,
      receiver: _to,
      receiverAmount: _receiverAmount ?? _senderAmount,
      receiverAccountId: _receiverAccountId,
      receiverAccountAmount: _receiverAccountAmount,
      rejectionmessgae: "",
    },
  });
};

export const executePayment = async (
  _from: string,
  _to: string,
  _amount: number,
  _message?: string
): Promise<string> => {
  let paymentoutcome: string = "Payment not executed";
  const sender: tUser | null = await loadUserWithUsernameOrEmail(_from);

  let isTransferToBank: boolean = false;

  // if (sender) {
  //   isTransferToBank = isLinkedBankOfUser(sender, _to);
  // }

  // if (sender && isTransferToBank) {
  if (sender && isTransferToBank) {
    const transactionID: string = generateUUID();
    createTransaction(
      transactionID,
      _from,
      sender.account?.id,
      sender.account?.amount,
      _amount,
      _message ?? null,
      _to
    );
    await removePayment(sender.account?.id, _amount, _to, transactionID);
  } else {
    const receiver: tUser | null = await loadUserWithUsernameOrEmail(_to);

    const email: tEmail = {
      destination: undefined,
      template: "",
      params: {},
      asHTML: true,
    };

    if (sender) {
      let senderAvailableAmount: number = 0;
      if (receiver) {
        if (sender.account) {
          senderAvailableAmount = sender.account.amount;
        }

        if (senderAvailableAmount < _amount) {
          paymentoutcome += ": amount insufficient";
          email.destination = sender.email;
          email.template = "AMOUNT_INSUFFICIENT";
          email.params = { sender: _from, receiver: _to };
        } else {
          const _currencySender: string =
            sender.address?.country?.currencycode!;
          const _currencySenderSymbol: string = decode(
            sender.address?.country?.symbol!
          );
          const _currencyReceiver: string =
            receiver.address?.country?.currencycode!;

          let amountPayableToReceiver: number = 0;
          await fetch(
            `https://v6.exchangerate-api.com/v6/${process.env.CURRENCY_API_KEY}/pair/${_currencySender}/${_currencyReceiver}/${_amount}`
          )
            .then((response: Response) => response.json())
            .then(
              (value: any) =>
                (amountPayableToReceiver = value.conversion_result)
            );

          const transactionID: string = generateUUID();
          createTransaction(
            transactionID,
            _from,
            sender.account?.id,
            sender.account?.amount,
            _amount,
            _message ?? null,
            _to,
            receiver.account?.id,
            receiver.account?.amount,
            amountPayableToReceiver
          );

          await removePayment(sender.account?.id, _amount, _to, transactionID);
          await addPayment(
            receiver.account?.id,
            amountPayableToReceiver,
            _from,
            transactionID
          );

          email.destination = receiver.email;
          email.cc = sender.email;

          // "parameters": "{receiverfirstname, receiverlastname, senderfirstname, senderlastname, senderamount, sendercurrencysymbol, sendercurrencycode, sendermessage, transactionid, transactiondate, transactiondirection}",
          const transactionDate: Date = new Date();

          email.params = {
            receiverfirstname: receiver.firstname,
            receiverlastname: receiver.lastname,
            senderfirstname: sender.firstname,
            senderlastname: sender.lastname,
            senderamount: _amount.toFixed(2),
            sendercurrencysymbol: _currencySenderSymbol,
            sendercurrencycode: _currencySender,
            transactionid: transactionID,
            transactiondate: renderDateInfo(transactionDate.toString()),
            transactiondirection: "received",
          };

          if (_message) {
            email.template = "EMAIL_WITH_TRANSACTION_MESSAGE";
            email.params.sendermessage = _message;
          } else {
            email.template = "EMAIL_WITH_TRANSACTION_NO_MESSAGE";
          }

          paymentoutcome = "Payment OK";
        }
      } else {
        paymentoutcome += ": receiver unknown in Europay";
        email.destination = sender.email;
        email.template = "RECEIVER_UNKNOWN";
        email.params = { sender: _from, receiver: _to };
      }
    } else {
      paymentoutcome += ": sender unknown in Europay";
    }

    if (email.destination) {
      await sendEmail(email);
    }
  }

  // revalidatePath(absoluteUrl("/user"));

  return paymentoutcome;
};
