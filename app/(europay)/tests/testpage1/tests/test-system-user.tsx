"use client";

import { executePayment } from "@/app/server/transaction";
import { testSystemUser } from "@/app/server/users";
import Button from "@/ui/button";
import React from "react";

const TestSystemUser = () => {
  const handleTest = async (): Promise<void> => {
    await testSystemUser("test");
  };

  return <Button name="SYSTEM USER" onClick={handleTest} />;
};

export default TestSystemUser;
