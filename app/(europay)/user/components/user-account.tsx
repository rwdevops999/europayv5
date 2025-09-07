import React from "react";
import UserCurrency from "./user-currency";
import UserAccountAmount from "./user-account-amount";

const UserAccount = () => {
  return (
    <div className="w-[100%] h-[100%]">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2 bg-transparant">
        <div>
          <div className="text-sm font-medium">Account</div>
          {/* <div className="text-xs text-muted-foreground">
            <UserProgression />
          </div> */}
        </div>
        <UserCurrency />
      </div>
      <div className="flex justify-center text-2xl font-bold">
        <UserAccountAmount />
      </div>
      {/* <div className="pt-2 text-xs text-muted-foreground">
        <UserProgression />
      </div> */}
    </div>
  );
};

export default UserAccount;
