"use client";

import { updateSetting } from "@/app/server/settings";
import { updateUserSetting } from "@/app/server/usersettings";
import { useToastSettings } from "@/hooks/use-toast-settings";
import { useUser } from "@/hooks/use-user";
import { defaultSetting } from "@/lib/constants";
import { tSetting, tUserSetting } from "@/lib/prisma-types";
import { ToastType } from "@/lib/types";
import { json, showToast } from "@/lib/util";
import { BsHourglassSplit } from "react-icons/bs";
import { GiToaster } from "react-icons/gi";
import { MdDynamicForm } from "react-icons/md";

const SetupToast = () => {
  const { user } = useUser();

  const { isToastOn, setToast, getToastDuration, setToastDuration } =
    useToastSettings();

  const updateValue = async (_id: number, _value: any): Promise<void> => {
    await updateUserSetting(_id, _value);
  };

  const handleToastChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setToast(event.target.checked);

      const setting: tUserSetting | undefined = user.settings.find(
        (usersetting: tUserSetting) => usersetting.key === "Toast"
      );

      if (setting) {
        updateValue(setting.id, event.target.checked.toString());
      }
    }
  };

  const handleToastDurationChange = (duration: string): void => {
    if (duration === "") {
      duration = "0";
    }

    if (user) {
      setToastDuration(parseInt(duration));
      const setting: tUserSetting | undefined = user.settings.find(
        (usersetting: tUserSetting) => usersetting.key === "ToastDuration"
      );

      if (setting) {
        updateValue(setting.id, duration);
      }
    }
  };

  const handleTestToast = (): void => {
    showToast(isToastOn(), ToastType.DEFAULT, "👋 Europay", getToastDuration());
  };

  return (
    <div>
      <div>
        <div className="flex space-x-2 items-center text-sm">
          <GiToaster size={16} />
          <div>Toast settings</div>
        </div>
        <div className="block space-y-2 mt-3">
          <div id="toastsettings" className="grid grid-cols-[15%_80%]">
            <div className="flex items-center">
              <label>Show toasts:</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="checkbox checkbox-xs rounded-sm"
                checked={isToastOn()}
                onChange={(event) => handleToastChange(event)}
              />
            </div>
          </div>
          <div id="toastduration" className="grid grid-cols-[15%_33%_5%]">
            <div className="flex items-center">
              <label>Toast duration:</label>
            </div>
            <div className="flex items-center">
              <label className="input">
                <BsHourglassSplit size={16} />
                <input
                  type="search"
                  value={getToastDuration()}
                  className="input-sm"
                  placeholder="milliseconds..."
                  onChange={(event) => {
                    console.log("INPUT Changed");
                    handleToastDurationChange(event.target.value);
                  }}
                />
              </label>
            </div>
            <div className="flex items-center">
              <div
                data-testid="testtoast"
                className="tooltip tooltip-bottom"
                data-tip={`Test toast`}
                onClick={handleTestToast}
              >
                <MdDynamicForm
                  size={16}
                  // color={isToastOn() ? "#fff" : "#555"}
                  color={isToastOn() ? "#0f0" : "#f00"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupToast;
