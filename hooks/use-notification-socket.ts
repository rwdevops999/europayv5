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
    console.log("[NOTIFICATION RECEIVER]", "useEffect");
    if (!socket) {
      console.log("[NOTIFICATION RECEIVER]", "useEffect", "No Socket");
      return;
    }

    console.log(
      "[NOTIFICATION RECEIVER]",
      "useEffect",
      "Waiting on",
      notificationKey
    );

    socket.on(notificationKey, (data: any) => {
      console.log(
        "[NOTIFICATION RECEIVER",
        "RECEIVED NOTIFICATION KEY",
        json(data)
      );
      notificationFunction(data);
    });

    return () => {
      socket.off(notificationKey);
    };
  }, [notificationKey, socket]);
};
