import { tUser } from "@/lib/prisma-types";
import React from "react";
import UserSelect from "./user-select";

const EuropayForm = ({
  users,
  user,
  sendUser,
}: {
  users: tUser[];
  user: tUser | null;
  sendUser: (_id: number) => void;
}) => {
  return (
    <div className="w-[100%]">
      <UserSelect users={users} sendUser={sendUser} />
    </div>
  );
};

export default EuropayForm;
