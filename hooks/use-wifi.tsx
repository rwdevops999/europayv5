"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { RiWifiLine, RiWifiOffLine } from "react-icons/ri";

interface WifiContextInterface {
  setTimeoutValue: (value: number) => void;
  getConnectNode: () => ReactNode;
  isConnected: () => boolean;
}

const WifiContext = createContext<WifiContextInterface | undefined>(undefined);

export const useWifi = () => {
  const context = useContext(WifiContext);
  if (context === undefined) {
    throw new Error("useWifi must be used within a WifiProvider");
  }
  return context;
};

type Wifi = {
  connection: string;
};

export const WifiProvider = ({ children }: { children: ReactNode }) => {
  const [connect, setConnect] = useState<Wifi>({ connection: "not connected" });
  const [timeoutValue, setTimeoutValue] = useState<number>(2000);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let connect: Wifi = { connection: "searching" };

      console.log("Checking WiFi");
      if (!navigator.onLine) {
        connect.connection = "not connected";
      } else {
        connect.connection = "connected";
      }

      setConnect({ ...connect });
    }, timeoutValue);

    return () => {
      clearTimeout(timeoutId);
    };
  });

  const getConnectNode = (): ReactNode => {
    return (
      <div className="h-5 w-8 flex items-center justify-center border border-foreground/30">
        {connect.connection === "connected" && (
          <div
            data-testid="internet-online"
            className="tooltip tooltip-bottom"
            data-tip={`Internet: ${connect.connection}`}
          >
            <RiWifiLine size={16} className="text-green-500" />
          </div>
        )}
        {connect.connection === "not connected" && (
          <div
            data-testid="internet-offline"
            className="tooltip tooltip-bottom"
            data-tip={`Internet: ${connect.connection}`}
          >
            <RiWifiOffLine size={16} className="text-red-500" />
          </div>
        )}
      </div>
    );
  };

  const isConnected = (): boolean => {
    return connect.connection === "connected";
  };

  return (
    <WifiContext.Provider
      value={{ getConnectNode, setTimeoutValue, isConnected }}
    >
      {children}
    </WifiContext.Provider>
  );
};

export default {
  WifiProvider,
  useWifi,
};
