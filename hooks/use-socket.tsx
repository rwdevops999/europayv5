"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { GiElectricalSocket } from "react-icons/gi";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
  getSocketNode: () => ReactNode;
  getSocket: () => any;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  getSocketNode: () => {
    return null;
  },
  getSocket: () => {
    return null;
  },
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // NEXT_PUBLIC_SITE_URL is localhost by default in development
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      { path: "/api/socket/io", addTrailingSlash: false }
    );

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    console.log("[SOCKET] set socket", socketInstance);

    setSocket(socketInstance);

    return () => {
      console.log("[SOCKET] disconnect socket", socketInstance);
      socketInstance.disconnect();
    };
  }, []);

  const getSocketNode = (): ReactNode => {
    return (
      <>
        {!isConnected && (
          <div className="flex items-center justify-center border border-foreground/30">
            <div
              data-testid="socket"
              className="tooltip tooltip-bottom"
              data-tip={`Socket: disconnected`}
            >
              <GiElectricalSocket className="text-yellow-600" size={12} />
            </div>
          </div>
        )}
        {isConnected && (
          <div className="flex items-center justify-center border border-foreground/30">
            <div
              data-testid="socket"
              className="tooltip tooltip-bottom"
              data-tip={`Socket: connected`}
            >
              <GiElectricalSocket className="text-emerald-600" size={12} />
            </div>
          </div>
        )}
      </>
    );
  };

  const getSocket = (): any => {
    return socket;
  };

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, getSocketNode, getSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default {
  SocketProvider,
  useSocket,
};
