"use server";

import { inngest } from "@/app/inngest/client";

export const runTestJob = async (_data: any): Promise<void> => {
  console.log("[SERVER]", "Send event to Inngest");
  const { ids } = await inngest.send({
    name: "europay/TestJobEvent",
    data: _data,
  });

  console.log("[SERVER]", "INNGEST JOB ID", ids[0]);
};

export const cancelTestJob = async (_data: any): Promise<void> => {
  console.log("[SERVER]", "Send event to Inngest");
  const { ids } = await inngest.send({
    name: "europay/TestJobEvent.suspend",
    data: _data,
  });

  console.log("[SERVER]", "INNGEST JOB ID", ids[0]);
};
