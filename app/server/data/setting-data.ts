import { tSettingCreate } from "@/lib/prisma-types";

export const appsettings: tSettingCreate[] = [
  // {
  //   type: "General",
  //   subtype: "Application",
  //   key: "Toast",
  //   value: process.env.NEXT_PUBLIC_SETTINGS_TOAST_ON ?? "true",
  // },
  // {
  //   type: "General",
  //   subtype: "Application",
  //   key: "ToastDuration",
  //   value: process.env.NEXT_PUBLIC_SETTINGS_TOAST_DURATION ?? "1500",
  // },
  // {
  //   type: "General",
  //   subtype: "Application",
  //   key: "Markdown",
  //   value: process.env.NEXT_PUBLIC_SETTINGS_MARKDOWN_ON ?? "true",
  // },
  {
    type: "General",
    subtype: "OTP",
    key: "Timing",
    value: process.env.NEXT_PUBLIC_SETTINGS_OTP_TIMING ?? "5'",
  },
  // {
  //   type: "General",
  //   subtype: "Application",
  //   key: "History",
  //   value: process.env.NEXT_PUBLIC_SETTINGS_HISTORY_LEVEL ?? "All",
  // },
  {
    type: "Limit",
    subtype: "Job",
    key: "TaskPoller",
    value: process.env.NEXT_PUBLIC_LIMIT_TASKPOLLER ?? "5'",
  },
  {
    type: "Limit",
    subtype: "Job",
    key: "TransactionPoller",
    value: process.env.NEXT_PUBLIC_LIMIT_TRANSACTIONPOLLER ?? "10'",
  },
];
