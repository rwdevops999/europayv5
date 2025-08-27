import {
  changeJobStatus,
  createJob,
  findJobByName,
  runInngestJob,
} from "@/app/server/job";
import { JobModel, JobStatus } from "@/generated/prisma";
import { tJob } from "@/lib/prisma-types";
import { listenNotificationSocket } from "./listen-notification-socket";

export const registerListener = async (
  socket: any,
  notificationKey: string,
  notificationFunction: (data: any) => void
) => {
  listenNotificationSocket({
    socket,
    notificationKey: notificationKey,
    notificationFunction: notificationFunction,
  });
};
