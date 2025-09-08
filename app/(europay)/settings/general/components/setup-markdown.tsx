"use client";

import { updateSetting } from "@/app/server/settings";
import { useMarkdownSettings } from "@/hooks/use-markdown-settings";
import { defaultSetting } from "@/lib/constants";
import { tSetting } from "@/lib/prisma-types";
import { useEffect, useState } from "react";
import { SiMarkdown } from "react-icons/si";

const SetupMarkdown = () => {
  const { markdown, setMarkdown } = useMarkdownSettings();

  const updateValue = async (_key: string, _value: any) => {
    const setting: tSetting = defaultSetting;
    setting.key = _key;
    setting.value = _value;

    await updateSetting(setting);
  };

  const handleMarkdownChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMarkdown(event.target.checked);

    updateValue("Markdown", event.target.checked.toString());
  };

  const [rerender, setRerender] = useState<number>(0);

  useEffect(() => {
    setRerender((x: number) => x + 1);
  }, [markdown]);

  return (
    <div>
      <div>
        <div className="flex space-x-2 items-center text-sm">
          <SiMarkdown size={16} />
          <div>Markdown settings</div>
        </div>
        <div className="block space-y-2 mt-3">
          <div id="markdownsettings" className="grid grid-cols-[35%_60%]">
            <div className="flex items-center">
              <label>Markdown:</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="checkbox checkbox-xs rounded-sm"
                checked={markdown}
                onChange={(event) => handleMarkdownChange(event)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupMarkdown;
