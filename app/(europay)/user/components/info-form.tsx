"use client";

import React, { useEffect, useState } from "react";
import { FaCoins } from "react-icons/fa6";
import { GiTwoCoins } from "react-icons/gi";

const InfoForm = ({
  sendInfo,
  sendAmount,
  sendMessage,
}: {
  sendInfo: boolean;
  sendAmount: (_amount: number) => void;
  sendMessage: (_message: string) => void;
}) => {
  const handleSendAmount = (): void => {
    let _amount: number = 0;

    const amountElement: HTMLInputElement = document.getElementById(
      "amount"
    ) as HTMLInputElement;
    if (amountElement) {
      _amount = parseFloat(amountElement.value);
      amountElement.value = "";
    }

    sendAmount(_amount);
  };

  const handleSendMessage = (): void => {
    let _message: string = "";

    const messageElement: HTMLTextAreaElement = document.getElementById(
      "message"
    ) as HTMLTextAreaElement;
    if (messageElement) {
      _message = messageElement.value;
      messageElement.value = "";
    }

    sendMessage(_message);
  };

  const [mayContinue, setMayContinue] = useState<boolean>(false);

  useEffect(() => {
    console.log("[InfoForm]:UE[sendInfo]");
    if (!mayContinue) {
      setMayContinue(true);
    } else {
      console.log("[InfoForm]:UE[sendInfo] => MAY CONTINUE");
      handleSendAmount();
      handleSendMessage();
    }
  }, [sendInfo]);

  return (
    <div className="block space-y-1">
      <div>
        <label className="input">
          <FaCoins size={16} />
          <input
            id="amount"
            type="text"
            className="input-sm"
            placeholder="amount"
          />
        </label>
      </div>
      <div>
        <textarea
          id="message"
          className="textarea resize-none"
          placeholder="Message..."
        ></textarea>
      </div>
    </div>
  );
};

export default InfoForm;
