"use client";

import { timings, tTimingGroup } from "@/app/client/data/timings-data";
import { createContext, ReactNode, useContext, useState } from "react";

interface OTPSettingsContextInterface {
  setTimingNotation: (value: string) => void;
  getTimingNotation: () => string;
  setTiming: (value: string) => void;
  getTimings: () => tTimingGroup[];
  getTimingValue: () => number;
  getTimingNode: () => ReactNode;
}

const OTPSettingsContext = createContext<
  OTPSettingsContextInterface | undefined
>(undefined);

export const useOTPSettings = () => {
  const context = useContext(OTPSettingsContext);
  if (context === undefined) {
    throw new Error("useOTPSettings must be used within a OTPSettingsProvider");
  }
  return context;
};

export const OTPSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [timingNotation, setTimingNotation] = useState<string | undefined>(
    undefined
  );
  const [timingValue, setTimingValue] = useState<number>(0);

  const setTiming = (timing: string): void => {
    const chars = timing.split("");

    const group: tTimingGroup | undefined = timings.find(
      (timing: tTimingGroup) => timing.char === chars[1]
    );

    if (group) {
      setTimingValue(parseInt(chars[0]) * group.accumulator);
    } else {
      setTimingValue(300000);
    }

    setTimingNotation(timing);
  };

  const getTimingValue = (): number => {
    return timingValue;
  };

  const getTimings = (): tTimingGroup[] => {
    return timings;
  };

  const getTimingNotation = (): string => {
    return timingNotation ?? "5'";
  };

  const getTimingNode = (): ReactNode => {
    return (
      <div className="flex items-center justify-center border border-foreground/30 cursor-default">
        <div
          data-testid="markdown"
          className="tooltip tooltip-bottom"
          data-tip={`OTP expiration`}
        >
          <div className="text-xs text-fuchsia-500">{getTimingNotation()}</div>
        </div>
      </div>
    );
  };

  return (
    <OTPSettingsContext.Provider
      value={{
        setTiming,
        getTimingNotation,
        setTimingNotation,
        getTimingValue,
        getTimings,
        getTimingNode,
      }}
    >
      {children}
    </OTPSettingsContext.Provider>
  );
};

export default {
  OTPSettingsProvider,
  useOTPSettings,
};
