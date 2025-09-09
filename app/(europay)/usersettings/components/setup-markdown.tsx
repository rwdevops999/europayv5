"use client";

import { updateSetting } from "@/app/server/settings";
import { updateUserSetting } from "@/app/server/usersettings";
import { useMarkdownSettings } from "@/hooks/use-markdown-settings";
import { useUser } from "@/hooks/use-user";
import { defaultSetting } from "@/lib/constants";
import { tSetting, tUserSetting } from "@/lib/prisma-types";
import { useEffect, useState } from "react";
import { SiMarkdown } from "react-icons/si";

const SetupMarkdown = () => {
  const { user } = useUser();

  const { markdown, setMarkdown } = useMarkdownSettings();

  // const updateValue = async (_key: string, _value: any) => {
  //   const setting: tSetting = defaultSetting;
  //   setting.key = _key;
  //   setting.value = _value;

  //   await updateSetting(setting);
  // };

  const updateValue = async (_id: number, _value: any): Promise<void> => {
    await updateUserSetting(_id, _value);
  };

  const handleMarkdownChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setMarkdown(event.target.checked);

      const setting: tUserSetting | undefined = user.settings.find(
        (usersetting: tUserSetting) => usersetting.key === "Markdown"
      );

      if (setting) {
        updateValue(setting.id, event.target.checked.toString());
      }
    }
  };

  // const [rerender, setRerender] = useState<number>(0);

  useEffect(() => {
    // setRerender((x: number) => x + 1);
  }, [markdown]);

  return (
    <div>
      <div>
        <div className="flex space-x-2 items-center text-sm">
          <SiMarkdown size={16} />
          <div>Markdown settings</div>
        </div>
        <div className="block space-y-2 mt-3">
          <div id="markdownsettings" className="grid grid-cols-[10%_40%]">
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
