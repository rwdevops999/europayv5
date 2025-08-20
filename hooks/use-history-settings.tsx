"use client";

import { HistoryType } from "@/generated/prisma";
import { createContext, ReactNode, useContext, useState } from "react";
import { MdHistoryEdu } from "react-icons/md";
import { TiInfoOutline } from "react-icons/ti";
import { AiOutlineThunderbolt } from "react-icons/ai";

interface HistorySettingsContextInterface {
  setHistory: (value: HistoryType | undefined) => void;
  getHistory: () => HistoryType | undefined;
  getHistoryNode: () => ReactNode;
  hasHistoryInfo: () => boolean;
  hasHistoryAction: () => boolean;
}

const HistorySettingsContext = createContext<
  HistorySettingsContextInterface | undefined
>(undefined);

export const useHistorySettings = () => {
  const context = useContext(HistorySettingsContext);
  if (context === undefined) {
    throw new Error(
      "useHistorySettings must be used within a HistorySettingsProvider"
    );
  }
  return context;
};

export const HistorySettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [history, setHistory] = useState<HistoryType | undefined>(
    HistoryType.ALL
  );

  const getHistory = (): HistoryType | undefined => {
    return history;
  };

  const hasHistoryInfo = () => {
    return history === HistoryType.INFO;
  };

  const hasHistoryAction = () => {
    return history === HistoryType.ACTION;
  };

  const getHistoryNode = (): ReactNode => {
    if (history === HistoryType.ALL) {
      return (
        <div className="flex items-center justify-center border border-foreground/30">
          <div
            data-testid="history"
            className="tooltip tooltip-bottom"
            data-tip={`History: ALL`}
          >
            <MdHistoryEdu size={14} className="text-green-500" />
          </div>
        </div>
      );
    } else if (history === HistoryType.INFO) {
      return (
        <div className="flex items-center justify-center border border-foreground/30">
          <div
            data-testid="history"
            className="tooltip tooltip-bottom"
            data-tip={`History: INFO`}
          >
            <TiInfoOutline size={14} color="#F97316" />
          </div>
        </div>
      );
    } else if (history === HistoryType.ACTION) {
      return (
        <div className="flex items-center justify-center border border-foreground/30">
          <div
            data-testid="internet-online"
            className="tooltip tooltip-bottom"
            data-tip={`History: ACTION`}
          >
            <AiOutlineThunderbolt size={16} color="#F97316" />
          </div>
        </div>
      );
    }

    return <div className="text-red-500 font-extrabold">H</div>;
  };

  return (
    <HistorySettingsContext.Provider
      value={{
        setHistory,
        getHistory,
        getHistoryNode,
        hasHistoryAction,
        hasHistoryInfo,
      }}
    >
      {children}
    </HistorySettingsContext.Provider>
  );
};

export default {
  HistorySettingsProvider,
  useHistorySettings,
};
