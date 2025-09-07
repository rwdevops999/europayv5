"use client";

import { createCronExpression } from "@/app/client/cron";
import { timings, tTimingGroup } from "@/app/client/data/timings-data";
import { json } from "@/lib/util";
import Button from "@/ui/button";
import React from "react";

const timing: string = "5'";

const CronTest = () => {
  const setTiming = (_timing: string): void => {
    const cron = createCronExpression(_timing);

    console.log("CRON:", cron);
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
