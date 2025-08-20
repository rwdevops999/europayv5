"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { DEFAULT_TOAST_DURATION } from "../lib/constants";
import { GiToaster } from "react-icons/gi";

interface ToastSettingsContextInterface {
  setToast: (value: boolean) => void;
  isToastOn: () => boolean;
  getToastNode: () => ReactNode;
  setToastDuration: (value: number) => void;
  getToastDuration: () => number;
}

const ToastSettingsContext = createContext<
  ToastSettingsContextInterface | undefined
>(undefined);

export const useToastSettings = () => {
  const context = useContext(ToastSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useToastSettings must be used within a ToastSettingsProvider"
    );
  }
  return context;
};

export const ToastSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [toast, setToast] = useState<boolean>(true);
  const [toastDuration, setToastDuration] = useState<number>(
    DEFAULT_TOAST_DURATION
  );

  const isToastOn = (): boolean => {
    return toast;
  };

  const getToastNode = (): ReactNode => {
    return (
      <div className="flex items-center justify-center border border-foreground/30">
        <div
          data-testid="toast"
          className="tooltip tooltip-bottom"
          data-tip={`Toast: ${toast ? "ON" : "OFF"} Duration: ${toastDuration}`}
        >
          {isToastOn() ? (
            <GiToaster className="text-green-500" size={14} />
          ) : (
            <GiToaster className="text-red-500" size={14} />
          )}
        </div>
      </div>
    );
  };

  const getToastDuration = (): number => {
    return toastDuration;
  };

  return (
    <ToastSettingsContext.Provider
      value={{
        setToast,
        isToastOn,
        setToastDuration,
        getToastDuration,
        getToastNode,
      }}
    >
      {children}
    </ToastSettingsContext.Provider>
  );
};

export default {
  ToastSettingsProvider,
  useToastSettings,
};
