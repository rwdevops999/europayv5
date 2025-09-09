"use client";

import { updateSetting } from "@/app/server/settings";
import { updateUserSetting } from "@/app/server/usersettings";
import { HistoryType } from "@/generated/prisma";
import { useHistorySettings } from "@/hooks/use-history-settings";
import { useUser } from "@/hooks/use-user";
import { defaultSetting } from "@/lib/constants";
import { tSetting, tUserSetting } from "@/lib/prisma-types";
import { useEffect, useState } from "react";
import { MdHistoryEdu } from "react-icons/md";

const SetupHistory = () => {
  const { user } = useUser();
  const { getHistory, setHistory } = useHistorySettings();

  const [selectedLogging, setSelectedLogging] = useState<
    HistoryType | undefined
  >();

  useEffect(() => {
    setSelectedLogging(getHistory());
  }, []);

  // const updateValue = async (_key: string, _value: any) => {
  //   const setting: tSetting = defaultSetting;
  //   setting.key = _key;
  //   setting.value = _value;

  //   await updateSetting(setting);
  // };

  const updateValue = async (_id: number, _value: any): Promise<void> => {
    await updateUserSetting(_id, _value);
  };

  const handleClickReset = (): void => {
    if (user) {
      setSelectedLogging(undefined);
      setHistory(HistoryType.ALL);

      const setting: tUserSetting | undefined = user.settings.find(
        (usersetting: tUserSetting) => usersetting.key === "History"
      );

      if (setting) {
        updateValue(setting.id, HistoryType.ALL);
      }
    }
  };

  const handleClickAll = (): void => {
    if (user) {
      setSelectedLogging(HistoryType.ALL);
      setHistory(HistoryType.ALL);

      const setting: tUserSetting | undefined = user.settings.find(
        (usersetting: tUserSetting) => usersetting.key === "History"
      );

      if (setting) {
        updateValue(setting.id, HistoryType.ALL);
      }
    }
  };

  const handleClickInfo = (): void => {
    if (user) {
      setSelectedLogging(HistoryType.INFO);
      setHistory(HistoryType.INFO);

      const setting: tUserSetting | undefined = user.settings.find(
        (usersetting: tUserSetting) => usersetting.key === "History"
      );

      if (setting) {
        updateValue(setting.id, HistoryType.INFO);
      }
    }
  };

  const handleClickAction = (): void => {
    if (user) {
      setSelectedLogging(HistoryType.ACTION);
      setHistory(HistoryType.ACTION);

      const setting: tUserSetting | undefined = user.settings.find(
        (usersetting: tUserSetting) => usersetting.key === "History"
      );

      if (setting) {
        updateValue(setting.id, HistoryType.ACTION);
      }
    }
  };

  const renderComponent = () => {
    return (
      <div>
        <div>
          <div className="flex space-x-2 items-center text-sm">
            <MdHistoryEdu size={16} />
            <div>History settings</div>
          </div>
          <div className="block space-y-2 mt-3">
            <div id="historysettings" className="grid grid-cols-[10%_40%]">
              <label>Logging:</label>
              <div className="filter">
                <div className="flex items-center space-x-2">
                  <input
                    className="btn btn-xs filter-reset"
                    type="radio"
                    name="historylogs"
                    aria-label={HistoryType.ALL}
                    onChange={handleClickReset}
                  />
                  <input
                    className="btn btn-xs"
                    type="radio"
                    name="historylogs"
                    aria-label={HistoryType.ALL}
                    onChange={handleClickAll}
                    checked={selectedLogging === HistoryType.ALL}
                  />
                  <input
                    className="btn btn-xs"
                    type="radio"
                    name="historylogs"
                    aria-label={HistoryType.INFO}
                    onChange={handleClickInfo}
                    checked={selectedLogging === HistoryType.INFO}
                  />
                  <input
                    className="btn btn-xs"
                    type="radio"
                    name="historylogs"
                    aria-label={HistoryType.ACTION}
                    onChange={handleClickAction}
                    checked={selectedLogging === HistoryType.ACTION}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <>{renderComponent()}</>;
};

export default SetupHistory;
