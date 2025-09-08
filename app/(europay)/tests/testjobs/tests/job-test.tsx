"use client";

import Button from "@/ui/button";
import React from "react";
import { cancelTestJob, runTestJob } from "./testjob";
import { createCronExpression, createDelayExpression } from "@/app/client/cron";

const timing: string = "2'";

const JobTest = () => {
  const handleRunJob = async (): Promise<void> => {
    // const cron = createCronExpression(timing);
    // console.log("[CLIENT]", "Run job", "CRON", cron);
    const delay = createDelayExpression(timing);
    console.log("[CLIENT]", "Run job", "DELAY", delay);

    await runTestJob({
      jobid: 125,
      delayexpression: delay,
    });
  };

  const handleCancelJob = async (): Promise<void> => {
    await cancelTestJob({
      jobid: 125,
      delayexpression: "",
    });
  };

  return (
    <div className="flex space-y-5">
      <Button name="Run Job" onClick={handleRunJob} />
      <Button name="Cancel Job" onClick={handleCancelJob} />
    </div>
  );
};

export default JobTest;
