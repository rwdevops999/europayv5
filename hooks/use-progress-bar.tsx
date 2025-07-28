"use client";

import { ProgressBarContext } from "@/ui/progress-bar";
import { useContext } from "react";

export const useProgressBar = () => {
  const progress = useContext(ProgressBarContext);

  if (progress === null) {
    throw new Error(
      "useProgressBar must be used within the ProgressBarProvider"
    );
  }

  return progress;
};
