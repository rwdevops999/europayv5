"use client";

import { updateSetting } from "@/app/server/settings";
import { HistoryType } from "@/generated/prisma";
import { useHistorySettings } from "@/hooks/use-history-settings";
import { defaultSetting } from "@/lib/constants";
import { tSetting } from "@/lib/prisma-types";
import { useEffect, useState } from "react";
import { MdHistoryEdu } from "react-icons/md";

const SetupHistory = () => {
  const { getHistory, setHistory } = useHistorySettings();

  const [selectedLogging, setSelectedLogging] = useState<
    HistoryType | undefined
  >();

  useEffect(() => {
    setSelectedLogging(getHistory());
  }, []);

  const updateValue = async (_key: string, _value: any) => {
    const setting: tSetting = defaultSetting;
    setting.key = _key;
    setting.value = _value;

    await updateSetting(setting);
  };

  const handleClickReset = (): void => {
    setSelectedLogging(undefined);
    setHistory(HistoryType.ALL);
    updateValue("History", HistoryType.ALL);
  };

  const handleClickAll = (): void => {
    setSelectedLogging(HistoryType.ALL);
    setHistory(HistoryType.ALL);
    updateValue("History", HistoryType.ALL);
  };

  const handleClickInfo = (): void => {
    setSelectedLogging(HistoryType.INFO);
    setHistory(HistoryType.INFO);
    updateValue("History", HistoryType.INFO);
  };

  const handleClickAction = (): void => {
    setSelectedLogging(HistoryType.ACTION);
    setHistory(HistoryType.ACTION);
    updateValue("History", HistoryType.ACTION);
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
            <div id="toastsettings" className="grid grid-cols-[35%_60%]">
              {/* <div className="flex items-center"> */}
              <label>Logging:</label>
              <div className="filter">
                <div className="flex items-center space-x-2">
                  <input
                    className="btn btn-xs filter-reset"
                    type="radio"
                    name="historylogs"
                    aria-label={HistoryType.ALL}
                    // checked={selectedLogging === HistoryType.ALL}
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
