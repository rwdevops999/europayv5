"use client";

import { createContext, ReactNode, useContext, useRef, useState } from "react";
import { json } from "../lib/util";
import { timings, tTimingGroup } from "@/app/client/data/timings-data";

interface JobContextInterface {
  jobCount: number;
  setJobCount: (value: number) => void;
  setJobTiming: (jobname: string, value: string) => void;
  getJobTiming: (jobname: string) => number;
  getJobTimings: () => tTimingGroup[];
  setJobTimingNotation: (jobname: string, value: string) => void;
  getJobTimingNotation: (jobsname: string) => string;
  displayInfo: () => void;
}

const JobContext = createContext<JobContextInterface | undefined>(undefined);

export const useJob = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJob must be used within a JobProvider");
  }
  return context;
};

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobCount, setJobCount] = useState<number>(0);

  const jobTimings = useRef<Record<string, number>>({});
  const jobTimingNotation = useRef<Record<string, string>>({});

  const setJobTimingNotation = (jobname: string, value: string): void => {
    jobTimingNotation.current[jobname] = value;
  };

  const getJobTimingNotation = (jobname: string): string => {
    return jobTimingNotation.current[jobname];
  };

  const setJobTiming = (jobname: string, timing: string): void => {
    const chars = timing.split("");
    const timingchar = chars[chars.length - 1];

    const group: tTimingGroup | undefined = timings.find(
      (timing: tTimingGroup) => timing.char === timingchar
    );
    if (group) {
      const timingvalue: string = timing.split(timingchar)[0];
      jobTimings.current[jobname] = parseInt(timingvalue) * group.accumulator;
    } else {
      jobTimings.current[jobname] = 300000;
    }

    jobTimingNotation.current[jobname] = timing;
  };

  const getJobTiming = (jobname: string): number => {
    return jobTimings.current[jobname];
  };

  const getJobTimings = (): tTimingGroup[] => {
    return timings;
  };

  const displayInfo = (): void => {
    console.log("jobTimings", json(jobTimings.current));
    console.log("jobTimingNotation", json(jobTimingNotation.current));
  };

  return (
    <JobContext.Provider
      value={{
        jobCount,
        setJobCount,
        setJobTiming,
        getJobTiming,
        getJobTimings,
        setJobTimingNotation,
        getJobTimingNotation,
        displayInfo,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export default {
  JobProvider,
  useJob,
};
