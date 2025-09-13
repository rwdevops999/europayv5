"use client";

import { tBankaccount, tUser } from "@/lib/prisma-types";
import React, { useEffect, useState } from "react";
import { BiSolidBank } from "react-icons/bi";

const BankSelect = ({
  _user,
  sendBank,
}: {
  _user: tUser | null;
  sendBank: (_id: number) => void;
}) => {
  const [selectedId, setSelectedId] = useState<number>(-1);

  const resetFields = (): void => {
    setSelectedId(-1);
  };

  useEffect(() => {
    setSelectedId(-1);
    resetFields();
  }, []);

  const handleSetBank = (event: any): void => {
    const id: number = parseInt(event.target.value);

    sendBank(id);

    setSelectedId(id);
  };

  return (
    <>
      <select
        value={selectedId}
        className="select-sm w-[93%] mb-1.5"
        onChange={(e) => handleSetBank(e)}
      >
        <option disabled={true} value={-1}>
          select
        </option>
        {_user?.account?.bankaccounts.map((_bankaccount: tBankaccount) => (
          <option key={_bankaccount.id} value={_bankaccount.id}>
            {_bankaccount.IBAN}
          </option>
        ))}
      </select>
    </>
  );
};

export default BankSelect;
