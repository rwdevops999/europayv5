"use client";

import { tTimingGroup } from "@/app/client/data/timings-data";
import { updateSetting } from "@/app/server/settings";
import { useOTPSettings } from "@/hooks/use-otp-settings";
import { defaultSetting } from "@/lib/constants";
import { tSetting } from "@/lib/prisma-types";
import { json } from "@/lib/util";
import { JSX, useEffect, useState } from "react";
import { CgPassword } from "react-icons/cg";
import { decode } from "html-entities";

const SetupOTP = () => {
  const { getTimings, setTiming, getTimingNotation } = useOTPSettings();

  const TimingGroup = ({ group }: { group: tTimingGroup }): JSX.Element => {
    console.log("[TimingGroup]", json(group), decode(group.notation));
    return (
      <>
        {group.values.map((timing: number) => {
          return (
            <option key={group.group + timing} value={timing + group.char}>
              {timing}
              {decode(group.notation)}
            </option>
          );
        })}
      </>
    );
  };

  const updateValue = async (_key: string, _value: any) => {
    const setting: tSetting = { ...defaultSetting, subtype: "OTP" };
    setting.key = _key;
    setting.value = _value;

    await updateSetting(setting);
  };

  const handleTiming = (timing: string): void => {
    updateValue("Timing", timing);
    setTiming(timing);
    setSelectedTiming(timing);
  };

  const [selectedTiming, setSelectedTiming] = useState<string>("5'");

  useEffect(() => {
    setSelectedTiming(getTimingNotation());
  }, []);

  const renderComponent = () => {
    return (
      <div>
        <div>
          <div className="flex space-x-2 items-center text-sm">
            <CgPassword size={16} />
            <div>OTP settings (One Time Password)</div>
          </div>
          <div className="block space-y-2 mt-3">
            <div id="otpsettings" className="grid grid-cols-[35%_60%]">
              <div className="flex items-center">
                <label>Timing:</label>
              </div>
              <div className="flex items-center">
                <select
                  value={selectedTiming}
                  className="select select-sm w-12/12"
                  onChange={(e) => handleTiming(e.target.value)}
                >
                  {getTimings().map((timinggroup: tTimingGroup) => {
                    return (
                      <TimingGroup
                        key={timinggroup.group}
                        group={timinggroup}
                      />
                      // </>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <>{renderComponent()}</>;
};

export default SetupOTP;
