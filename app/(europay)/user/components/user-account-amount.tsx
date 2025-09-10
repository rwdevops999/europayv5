"use client";

import { getAccountAmount } from "@/app/server/account";
import { useTransaction } from "@/hooks/use-transaction";
import { useUser } from "@/hooks/use-user";
import { useEffect, useState } from "react";

const cid: string = "UserAccountAmount";

const UserAccountAmount = () => {
  const { user } = useUser();
  const { transactions } = useTransaction();

  const [amount, setAmount] = useState<string | null>(null);

  const loadAccountAmount = async (): Promise<void> => {
    if (user && user.account) {
      const amount: string | null = await getAccountAmount(
        user.account.id,
        user.address?.country?.currencycode!
      );
      setAmount(amount);
    } else {
      setAmount("");
    }
  };

  useEffect(() => {
    loadAccountAmount();
  }, []);

  useEffect(() => {
    loadAccountAmount();
  }, [transactions]);

  return <div>{amount}</div>;
};

export default UserAccountAmount;
