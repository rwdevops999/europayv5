import { json } from "@/lib/util";

type ListenNotificationSocketProps = {
  socket: any;
  notificationKey: string;
  notificationFunction: (data: any) => void;
};

export const listenNotificationSocket = ({
  socket,
  notificationKey,
  notificationFunction,
}: ListenNotificationSocketProps) => {
  console.log("[listenNotificationSocket]", "useEffect");
  if (!socket) {
    console.log("[listenNotificationSocket]", "useEffect", "No Socket");
    return;
  }

  console.log(
    "[listenNotificationSocket]",
    "useEffect",
    "Waiting on",
    notificationKey
  );

  socket.on(notificationKey, (data: any) => {
    console.log(
      "[listenNotificationSocket]",
      "RECEIVED NOTIFICATION => FORWARD to function",
      json(data)
    );

    notificationFunction(data);
  });
};
