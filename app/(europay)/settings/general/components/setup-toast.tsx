"use client";

import { updateSetting } from "@/app/server/settings";
import { useToastSettings } from "@/hooks/use-toast-settings";
import { defaultSetting } from "@/lib/constants";
import { tSetting } from "@/lib/prisma-types";
import { ToastType } from "@/lib/types";
import { showToast } from "@/lib/util";
import { BsHourglassSplit } from "react-icons/bs";
import { GiToaster } from "react-icons/gi";
import { MdDynamicForm } from "react-icons/md";

const SetupToast = () => {
  const { isToastOn, setToast, getToastDuration, setToastDuration } =
    useToastSettings();

  const updateValue = async (_key: string, _value: any) => {
    const setting: tSetting = defaultSetting;
    setting.key = _key;
    setting.value = _value;

    await updateSetting(setting);
  };

  const handleToastChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToast(event.target.checked);

    updateValue("Toast", event.target.checked.toString());
  };

  const handleToastDurationChange = (duration: string): void => {
    if (duration === "") {
      duration = "0";
    }

    setToastDuration(parseInt(duration));
    updateValue("ToastDuration", duration);
  };

  const handleTestToast = (): void => {
    if (isToastOn()) {
      showToast(ToastType.DEFAULT, "👋 Europay", getToastDuration());
    }
  };

  return (
    <div>
      <div>
        <div className="flex space-x-2 items-center text-sm">
          <GiToaster size={16} />
          <div>Toast settings</div>
        </div>
        <div className="block space-y-2 mt-3">
          <div id="toastsettings" className="grid grid-cols-[35%_60%]">
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
          <div id="toastduration" className="grid grid-cols-[35%_60%_5%]">
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
                  onChange={(event) =>
                    handleToastDurationChange(event.target.value)
                  }
                />
              </label>
            </div>
            <div className="ml-1 flex items-center justify-end">
              <div
                data-testid="testtoast"
                className="tooltip tooltip-left"
                data-tip={`Test toast`}
                onClick={handleTestToast}
              >
                <MdDynamicForm
                  size={16}
                  color={isToastOn() ? "#fff" : "#555"}
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
