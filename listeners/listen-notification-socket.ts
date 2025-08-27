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
  if (!socket) {
    return;
  }

  socket.on(notificationKey, (data: any) => {
    notificationFunction(data);
  });
};
