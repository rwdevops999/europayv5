"use client";

import { loadSettings } from "@/app/server/settings";
import { useMarkdownSettings } from "@/hooks/use-markdown-settings";
import { useToastSettings } from "@/hooks/use-toast-settings";
import { DEFAULT_TOAST_DURATION } from "@/lib/constants";
import { tSetting } from "@/lib/prisma-types";
import { useEffect } from "react";

const ProcessSettings = () => {
  const { setToast, setToastDuration } = useToastSettings();
  const { setMarkdown } = useMarkdownSettings();

  const handleSettings = async (): Promise<void> => {
    let settings: tSetting[] = [];

    settings = await loadSettings(["General"], ["Application"], []);

    let setting: tSetting | undefined;

    setting = settings.find((setting: tSetting) => setting.key === "Toast");

    if (setting && setting.value.toLocaleLowerCase() === "false") {
      setToast(false);
    } else {
      setToast(
        process.env.NEXT_PUBLIC_SETTINGS_TOAST_ON
          ? process.env.NEXT_PUBLIC_SETTINGS_TOAST_ON.toLowerCase() === "true"
          : true
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
          process.env.NEXT_PUBLIC_SETTINGS_TOAST_DURATION
            ? process.env.NEXT_PUBLIC_SETTINGS_TOAST_DURATION
            : DEFAULT_TOAST_DURATION.toString()
        )
      );
    }

    setting = settings.find((setting: tSetting) => setting.key === "Markdown");

    if (setting && setting.value.toLowerCase() === "false") {
      setMarkdown(false);
    } else {
      setMarkdown(
        process.env.NEXT_PUBLIC_SETTINGS_MARKDOWN_ON
          ? process.env.NEXT_PUBLIC_SETTINGS_MARKDOWN_ON.toLowerCase() ===
              "true"
          : true
      );
    }
  };

  useEffect(() => {
    handleSettings();
  }, []);

  return null;
};

export default ProcessSettings;
