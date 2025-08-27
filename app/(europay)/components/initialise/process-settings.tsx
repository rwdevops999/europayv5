"use client";

import { loadSettings } from "@/app/server/settings";
import { HistoryType } from "@/generated/prisma";
import { useHistorySettings } from "@/hooks/use-history-settings";
import { useJob } from "@/hooks/use-job";
import { useMarkdownSettings } from "@/hooks/use-markdown-settings";
import { useOTPSettings } from "@/hooks/use-otp-settings";
import { useToastSettings } from "@/hooks/use-toast-settings";
import { DEFAULT_TOAST_DURATION } from "@/lib/constants";
import { tSetting } from "@/lib/prisma-types";
import { json } from "@/lib/util";
import { useEffect } from "react";

const envToastOn: string | undefined =
  process.env.NEXT_PUBLIC_SETTINGS_TOAST_ON;
const envHistoryLevel: string | undefined =
  process.env.NEXT_PUBLIC_SETTINGS_HISTORY_LEVEL;
const envToastDuration: string | undefined =
  process.env.NEXT_PUBLIC_SETTINGS_TOAST_DURATION;
const envMarkdownOn: string | undefined =
  process.env.NEXT_PUBLIC_SETTINGS_MARKDOWN_ON;
const envOtpTiming: string | undefined =
  process.env.NEXT_PUBLIC_SETTINGS_OTP_TIMING;

const ProcessSettings = ({
  start,
  proceed,
}: {
  start: boolean;
  proceed: (value: boolean) => void;
}) => {
  const { setToast, setToastDuration } = useToastSettings();
  const { setMarkdown } = useMarkdownSettings();
  const { setTiming } = useOTPSettings();
  const { setHistory } = useHistorySettings();
  const { setJobTiming, displayInfo } = useJob();

  const handleSettings = async (): Promise<void> => {
    let settings: tSetting[] = [];

    settings = await loadSettings(["General"], ["Application"], []);

    let setting: tSetting | undefined;

    setting = settings.find((setting: tSetting) => setting.key === "Toast");

    if (setting && setting.value.toLocaleLowerCase() === "false") {
      setToast(false);
    } else {
      setToast(envToastOn ? envToastOn.toLowerCase() === "true" : true);
    }

    setting = settings.find((setting: tSetting) => setting.key === "History");

    if (setting) {
      setHistory(HistoryType[setting.value as keyof typeof HistoryType]);
    } else {
      setHistory(
        envHistoryLevel
          ? HistoryType[envHistoryLevel as keyof typeof HistoryType]
          : HistoryType.ALL
      );
    }

    setting = settings.find(
      (setting: tSetting) => setting.key === "ToastDuration"
    );

    if (setting) {
      setToastDuration(parseInt(setting.value));
    } else {
      setToastDuration(
        parseInt(
          envToastDuration
            ? envToastDuration
            : DEFAULT_TOAST_DURATION.toString()
        )
      );
    }

    setting = settings.find((setting: tSetting) => setting.key === "Markdown");

    if (setting && setting.value.toLowerCase() === "false") {
      setMarkdown(false);
    } else {
      setMarkdown(
        envMarkdownOn ? envMarkdownOn.toLowerCase() === "true" : true
      );
    }

    settings = await loadSettings(["General"], ["OTP"], []);

    setting = settings.find((setting: tSetting) => setting.key === "Timing");

    if (setting) {
      setTiming(setting.value);
    } else {
      setTiming(envOtpTiming ? envOtpTiming : "5'");
    }
  };

  const handleLimits = async (): Promise<void> => {
    let settings: tSetting[] = [];

    settings = await loadSettings(["Limit"], ["Job"], []);

    settings.forEach((settings: tSetting) => {
      setJobTiming(settings.key, settings.value);
    });

    displayInfo();
  };

  const process = async (): Promise<void> => {
    await handleSettings().then(async () => {
      await handleLimits().then(() => proceed(true));
    });
  };

  useEffect(() => {
    if (start) {
      process();
    }
  }, [start]);

  return null;
};

export default ProcessSettings;
