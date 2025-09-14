"use client";

import { loadUserById, loadUsers } from "@/app/server/users";
import { useUser } from "@/hooks/use-user";
import { tBankaccount, tUser } from "@/lib/prisma-types";
import BankIcon from "@/ui/icons/bank-icon";
import EuropayIcon from "@/ui/icons/europay-icon";
import React, { useEffect, useRef, useState } from "react";
import EuropayForm from "./europay-form";
import BankForm from "./bank-form";
import InfoForm from "./info-form";
import Button from "@/ui/button";
import CreditcardIcon from "@/ui/icons/creditcard-icon";
import NotificationDialog from "@/ui/notification-dialog";
import { executePayment } from "@/app/server/transaction";
import { loadBankAccountById } from "@/app/server/bankaccounts";

type tNotificationButton = {
  leftButton?: string;
  centerButton?: string;
  rightButton?: string;
};

type tNotification = {
  _open: boolean;
  _template: string;
  _params: Record<string, string>;
  _buttonnames: tNotificationButton;
  _className?: string;
  _data?: any;
};

enum Pages {
  EUROPAY = "europay",
  BANK = "bankaccount",
}

const UserPayment = () => {
  const { user } = useUser();
  const currentPage = useRef<string>(Pages.EUROPAY);

  const [users, setUsers] = useState<tUser[]>([]);
  const [sendInfo, setSendInfo] = useState<boolean>(false);

  const [notification, setNotification] = useState<tNotification | undefined>(
    undefined
  );

  const showPaymentRejectedNotification = (
    _message: string,
    _expected: string
  ): void => {
    if (_message !== _expected) {
      let notification: tNotification = {
        _open: true,
        _template: "PAYMENT_MESSAGE",
        _params: { message: _message },
        _buttonnames: { leftButton: "Ok" },
      };

      setNotification(notification);
    }
  };

  const showInvalidDestinaryNotification = (): void => {
    let notification: tNotification = {
      _open: true,
      _template: "DESTINARY_INVALID",
      _params: {},
      _buttonnames: { leftButton: "Ok" },
    };

    setNotification(notification);
  };

  const showAmountInvalidNotification = (): void => {
    let notification: tNotification = {
      _open: true,
      _template: "AMOUNT_INVALID",
      _params: {},
      _buttonnames: { leftButton: "Ok" },
    };

    setNotification(notification);
  };

  const closeNotificationDialog = (): void => {
    let notification: tNotification = {
      _open: false,
      _template: "DESTINARY_INVALID",
      _params: {},
      _buttonnames: { leftButton: "" },
    };

    setNotification(notification);
  };

  const handleCancelClick = (): void => {
    closeNotificationDialog();
  };

  const loadAllUsers = async (): Promise<void> => {
    let users: tUser[] = await loadUsers();

    if (user) {
      const index: number = users.findIndex(
        (_user: tUser) => _user.email === user.email
      );
      if (index !== -1) {
        users.splice(index, 1);
      }
    }

    setUsers(users);
  };

  useEffect(() => {
    loadAllUsers();
  }, []);

  const handleEuropayPage = (): void => {
    currentPage.current = Pages.EUROPAY;
    location.href = `#${Pages.EUROPAY}`;
  };

  const handleBankPage = (): void => {
    currentPage.current = Pages.BANK;
    location.href = `#${Pages.BANK}`;
  };

  const sendPayment = async (): Promise<void> => {
    console.log("SEND PAYMENT", userId.current, bankId.current, amount.current);
    if (userId.current === -1 && bankId.current === -1) {
      showInvalidDestinaryNotification();
    } else if (isNaN(amount.current)) {
      showAmountInvalidNotification();
    }

    if (userId.current !== -1) {
      await loadUserById(userId.current).then(
        async (recipient: tUser | null) => {
          if (user && recipient) {
            const _message: string = await executePayment(
              user.email,
              recipient.email,
              amount.current,
              message.current
            );

            showPaymentRejectedNotification(
              _message,
              "Client transaction done"
            );
          }
        }
      );
    }

    if (bankId.current !== -1) {
      await loadBankAccountById(bankId.current).then(
        async (recipient: tBankaccount | null) => {
          if (user && recipient) {
            const _message = await executePayment(
              user.email,
              recipient.IBAN,
              amount.current,
              message.current
            );

            showPaymentRejectedNotification(_message, "Bank transaction done");
          }
        }
      );

      console.log("BANK PAYMENT");
    }
  };

  const userId = useRef<number>(-1);
  const handleGetUser = (_id: number) => {
    console.log("USERID: ", _id);
    userId.current = _id;
    // sendPayment();
  };

  const bankId = useRef<number>(-1);
  const handleGetBank = (_id: number) => {
    console.log("BANKID: ", _id);
    bankId.current = _id;
    // sendPayment();
  };

  const amount = useRef<number>(0);
  const message = useRef<string>("");
  const handleGetAmount = (_amount: number) => {
    console.log("AMOUNT: ", _amount);
    amount.current = _amount;
  };

  const handleGetMessage = (_message: string) => {
    console.log("MESSAGE: ", _message);
    message.current = _message;
    sendPayment();
  };

  const handleSendClick = (): void => {
    setSendInfo((x: boolean) => (x = !x));
    // sendPayment();
  };

  return (
    <>
      <div className="flex w-full justify-center gap-2 py-2 space-x-5">
        <button
          type="button"
          className="flex items-center space-x-2"
          onClick={handleEuropayPage}
        >
          <EuropayIcon />
        </button>
        <button
          type="button"
          className="flex items-center space-x-2"
          onClick={handleBankPage}
        >
          <BankIcon />
        </button>
      </div>
      <div className="carousel w-full">
        <div id={Pages.EUROPAY} className="carousel-item w-full">
          <EuropayForm users={users} user={user} sendUser={handleGetUser} />
        </div>
        <div id={Pages.BANK} className="carousel-item w-full">
          <BankForm user={user} sendBank={handleGetBank} />
        </div>
      </div>
      <div>
        <InfoForm
          sendInfo={sendInfo}
          sendAmount={handleGetAmount}
          sendMessage={handleGetMessage}
        />
        <div className="mt-1 flex justify-center">
          <Button name="Send" className="bg-custom" onClick={handleSendClick} />
        </div>
      </div>
      <NotificationDialog
        _open={notification?._open}
        _template={notification?._template}
        _params={notification?._params}
        _buttonnames={notification?._buttonnames}
        _handleButtonLeft={handleCancelClick}
        _data={notification?._data}
      />
    </>
  );
};

export default UserPayment;
