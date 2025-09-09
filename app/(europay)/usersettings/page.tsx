"use client";

import { useEffect, useState } from "react";
import StartSettings from "./components/start-settings";
import { useSearchParams } from "next/navigation";
import { json } from "@/lib/util";

const UserSettingsDialog = () => {
  const searchParams = useSearchParams();

  const id = searchParams?.get("id");

  console.log("SP", id);

  const renderComponent = () => {
    return <StartSettings open={id} />;
  };

  return <>{renderComponent()}</>;
};

export default UserSettingsDialog;
