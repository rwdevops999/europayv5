"use client";

import { useUser } from "@/hooks/use-user";
import React, { ReactElement } from "react";
import ReactHtmlParser from "react-html-parser";

const UserCurrency = () => {
  const { user } = useUser();

  const currencySymbol: ReactElement[] | null =
    user && user.address && user.address.country
      ? ReactHtmlParser(user.address.country?.symbol!)
      : null;

  return <div className="text-2xl">{currencySymbol ?? ""}</div>;
};

export default UserCurrency;
