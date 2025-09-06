import { toast } from "react-toastify";
import { ToastFn } from "./types";
import { tSetting } from "./prisma-types";

export const URL_ENCODING_ASSIGNMENT = "%3D";
export const URL_ENCODING_AMPERSAND = "%26";

export const DATATABLE_ACTION_DELETE = "DTA_DELETE";
export const DATATABLE_ACTION_UPDATE = "DTA_UPDATE";

export const DEFAULT_TOAST_DURATION: number = 1500;

export const ToastTypes: Record<string, ToastFn> = {
  default: toast,
  info: toast.info,
  success: toast.success,
  warning: toast.warn,
  error: toast.error,
};

export const DEFAULT_COUNTRY: string = "Belgium";

export const defaultSetting: tSetting = {
  id: -1,
  type: "General",
  subtype: "Application",
  key: "",
  value: "",
};

// JOBS and related
export const TaskPollerJobName: string = "TaskPoller";
export const taskKey: string = "key:task";

export const TransactionPollerJobName: string = "TransactionPoller";
export const transactionKey: string = "key:transaction";

export const GROUP_ADMINS = "ADMIN";
export const GROUP_CLIENTS = "CLIENT";
