"use client";

import { IBANStatus } from "@/generated/prisma";
import { useUser } from "@/hooks/use-user";
import { tBankaccount, tUser } from "@/lib/prisma-types";
import { ScrollBar } from "@/ui/radix/scroll-area";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import clsx from "clsx";
import { startTransition, useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";
import {
  electonicFormatIBAN as electronicFormatIBAN,
  isValidIBAN,
} from "ibantools";
import {
  deleteBankAccountById,
  linkBankAccount,
  loadLinkedBankAccounts,
} from "@/app/server/bankaccounts";
import { PiBankDuotone } from "react-icons/pi";
import Button from "@/ui/button";
import NotificationDialog from "@/ui/notification-dialog";
import { useRouter } from "next/navigation";
import { absoluteUrl } from "@/lib/util";
import { useProgressBar } from "@/hooks/use-progress-bar";
import { loadUserById } from "@/app/server/users";

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

const BankaccountItem = ({
  bankaccount,
  deleteBankAccount,
}: {
  bankaccount: tBankaccount;
  deleteBankAccount: (_id: number) => void;
}) => {
  const handleDelete = (_bankaccountid: number): void => {
    deleteBankAccount(_bankaccountid);
  };

  return (
    <div className="border-1 border-accent-content">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs">{bankaccount.IBAN}</label>
        </div>
        <div className="grid items-center grid-cols-[75%_25%]">
          <label
            className={clsx(
              "text-xs font-bold",
              { "text-green-500": bankaccount.status === IBANStatus.VALID },
              { "text-red-500": bankaccount.status === IBANStatus.INVALID }
            )}
          >
            {bankaccount.status}
          </label>
          <CiTrash
            className="cursor-pointer"
            size={16}
            onClick={() => handleDelete(bankaccount.id)}
          />
        </div>
      </div>
    </div>
  );
};

const BankAccountList = ({
  bankAccounts,
  deleteBankAccount,
}: {
  bankAccounts: tBankaccount[];
  deleteBankAccount: (_id: number) => void;
}) => {
  return (
    <ul className="list bg-base-100 rounded-box shadow-md">
      <ScrollArea className="overflow-auto h-[15vw] w-[100%]">
        {bankAccounts.map((_bankaccount: tBankaccount) => (
          <li key={_bankaccount.id}>
            <BankaccountItem
              bankaccount={_bankaccount}
              deleteBankAccount={deleteBankAccount}
            />
          </li>
        ))}
        <ScrollBar className="bg-foreground/30" />
      </ScrollArea>
    </ul>
  );
};

const BankAccounts = () => {
  const { user, setUser } = useUser();

  const [notification, setNotification] = useState<tNotification | undefined>(
    undefined
  );

  const showInvalidIBANNotification = (_iban: string): void => {
    let notification: tNotification = {
      _open: true,
      _template: "IBAN_INVALID",
      _params: { iban: _iban },
      _buttonnames: { leftButton: "Ok" },
    };

    setNotification(notification);
  };

  const closeNotificationDialog = (): void => {
    let notification: tNotification = {
      _open: false,
      _template: "IBAN_INVALID",
      _params: { iban: "" },
      _buttonnames: { leftButton: "" },
    };

    setNotification(notification);
  };

  const [buttonEnabled, setButtonEnabled] = useState<boolean>(false);

  const clearIBANInput = (): void => {
    console.log("[handleLinkAccount] IN");
    const element: HTMLInputElement = document.getElementById(
      "ibaninput"
    ) as HTMLInputElement;

    if (element) {
      element.value = "";
    }
  };

  const handleIBANInput = (e: any): void => {
    const iban: string = e.target.value;

    setButtonEnabled(iban !== "");
  };

  const handleLinkAccount = async (): Promise<void> => {
    console.log("[handleLinkAccount] IN");
    const element: HTMLInputElement = document.getElementById(
      "ibaninput"
    ) as HTMLInputElement;

    if (element) {
      const iban: string | null = electronicFormatIBAN(element.value);
      console.log("[handleLinkAccount] IBAN", iban);

      if (iban) {
        let status: IBANStatus = IBANStatus.INVALID;

        const valid = isValidIBAN(iban);
        if (valid) {
          status = IBANStatus.VALID;
        }

        console.log("[handleLinkAccount] IBAN VALID", valid);

        if (!valid) {
          showInvalidIBANNotification(iban);
        } else {
          if (user && user.account) {
            const bankaccountIsLinked: boolean = user.account.bankaccounts.some(
              (bankaccount: tBankaccount) => bankaccount.IBAN === iban
            );

            if (!bankaccountIsLinked) {
              await linkBankAccount(iban, user.account.id, status).then(
                async () => {
                  const reloadedUser: tUser | null = await loadUserById(
                    user.id
                  );
                  setUser(reloadedUser);
                }
              );
            }

            clearIBANInput();
            setRefresh((x: number) => x + 1);
          }
        }
      }
    }
  };

  const [bankAccounts, setBankAccounts] = useState<tBankaccount[]>([]);

  const loadBankAccounts = async (_accountid: number): Promise<void> => {
    setBankAccounts(await loadLinkedBankAccounts(_accountid));
  };

  useEffect(() => {
    setButtonEnabled(false);
    if (user && user.account) {
      loadBankAccounts(user.account.id);
    }
  }, []);

  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    setButtonEnabled(false);
    if (user && user.account) {
      loadBankAccounts(user.account.id);
    }
  }, [refresh]);

  const deleteBankAccount = async (_id: number): Promise<void> => {
    await deleteBankAccountById(_id);
    setRefresh((x: number) => x + 1);
  };

  const handleCancelClick = (): void => {
    closeNotificationDialog();
  };

  return (
    <div className="space-y-2">
      <div>
        <label className="input">
          <PiBankDuotone />
          <input
            id="ibaninput"
            type="text"
            placeholder="IBAN..."
            onChange={(e) => handleIBANInput(e)}
            className="input-sm"
          />
        </label>
      </div>
      <div>
        <Button
          name="Link account"
          size="small"
          className="w-[94%] bg-custom"
          disabled={!buttonEnabled}
          onClick={handleLinkAccount}
        />
      </div>
      <div className="w-[94%]">
        <BankAccountList
          bankAccounts={bankAccounts}
          deleteBankAccount={deleteBankAccount}
        />
      </div>
      <NotificationDialog
        _open={notification?._open}
        _template={notification?._template}
        _params={notification?._params}
        _buttonnames={notification?._buttonnames}
        _handleButtonLeft={handleCancelClick}
        _data={notification?._data}
      />
    </div>
  );
};

export default BankAccounts;
