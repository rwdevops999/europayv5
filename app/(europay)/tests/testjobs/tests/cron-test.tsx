"use client";

import { createCronExpression, createDelayExpression } from "@/app/client/cron";
import Button from "@/ui/button";
import React from "react";

const timing: string = "10'";

const CronTest = () => {
  const setTiming = (_timing: string): void => {
    const delay = createDelayExpression(timing);

    console.log("DELAY", delay);
  };

  const handleCreateCron = (): void => {
    setTiming(timing);
  };

  return (
    <div>
      <Button name="CreateCron" onClick={handleCreateCron} />
    </div>
  );
};

export default CronTest;
