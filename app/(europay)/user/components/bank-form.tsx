import { tUser } from "@/lib/prisma-types";
import React from "react";
import BankSelect from "./bank-select";

const BankForm = ({
  user,
  sendBank,
}: {
  user: tUser | null;
  sendBank: (_id: number) => void;
}) => {
  return (
    <div className="w-[100%]">
      <BankSelect _user={user} sendBank={sendBank} />
    </div>
  );
};

export default BankForm;
