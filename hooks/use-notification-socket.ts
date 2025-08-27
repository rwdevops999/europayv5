import { useEffect, useState } from "react";
import { useSocket } from "./use-socket";
import { json } from "@/lib/util";

type NotificationSocketProps = {
  socket: any;
  notificationKey: string;
  notificationFunction: (data: any) => void;
};

export const useNotificationSocket = ({
  socket,
  notificationKey,
  notificationFunction,
}: NotificationSocketProps) => {
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(notificationKey, (data: any) => {
      notificationFunction(data);
    });

    return () => {
      socket.off(notificationKey);
    };
  }, [notificationKey, socket]);
};
