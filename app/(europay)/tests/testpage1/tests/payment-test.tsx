"use client";

import { executePayment } from "@/app/server/transaction";
import Button from "@/ui/button";
import React from "react";

const PaymentTest = () => {
  const handlePayment = async (): Promise<void> => {
    const message: string = await executePayment(
      "AAA2",
      "BE00-0000000000-00",
      5,
      "The message"
    );
    console.log("PAYMENT REPLAY", message);
  };

  return <Button name="PAY" onClick={handlePayment} />;
};

export default PaymentTest;
