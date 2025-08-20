"use client";

import Button from "@/ui/button";
import { sendNotification } from "./test";
import { taskKey } from "@/lib/constants";

const TestSockets = ({ setup = false }: { setup: boolean }) => {
  const handleSendTask = async (): Promise<void> => {
    await sendNotification(taskKey, 1234);
  };

  return (
    <div>
      <Button name="Send Task" onClick={handleSendTask} />;
      {/* <Button name="Send Transaction" onClick={handleSendTransaction} />; */}
    </div>
  );
};

export default TestSockets;
