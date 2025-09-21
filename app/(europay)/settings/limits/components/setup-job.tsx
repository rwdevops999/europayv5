"use client";

import { tTimingGroup } from "@/app/client/data/timings-data";
import { $iam_user_has_action } from "@/app/client/iam-access";
import { updateSetting } from "@/app/server/settings";
import { useJob } from "@/hooks/use-job";
import { useUser } from "@/hooks/use-user";
import { tSetting } from "@/lib/prisma-types";
import { JSX, useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";

const SetupJob = ({
  jobname,
  env,
  accessAction,
}: {
  jobname: string;
  env: string;
  accessAction: string;
}) => {
  const { setJobTiming, getJobTimings, getJobTimingNotation, displayInfo } =
    useJob();
  const { user } = useUser();

  const allowed: boolean = $iam_user_has_action(
    user,
    "europay:settings:limits:jobs",
    `${accessAction} Limit`
  );

  const fulljobname = `${jobname}Poller`;

  const TimingGroup = ({ group }: { group: tTimingGroup }): JSX.Element => {
    return (
      <>
        {group.values.map((timing: number) => {
          return (
            <option key={group.group + timing} value={timing + group.char}>
              {timing}
              {ReactHtmlParser(group.notation)}
            </option>
          );
        })}
      </>
    );
  };

  const defaultSetting: tSetting = {
    id: -1,
    type: "Limit",
    subtype: "Job",
    key: "",
    value: "",
  };

  const updateValue = async (_key: string, _value: any) => {
    const setting: tSetting = { ...defaultSetting };
    setting.key = _key;
    setting.value = _value;

    await updateSetting(setting);
  };

  const handleTiming = (timing: string): void => {
    updateValue(fulljobname, timing);
    setJobTiming(fulljobname, timing);
    setSelectedTiming(timing);
  };

  const [selectedTiming, setSelectedTiming] = useState<string>("5'");

  const setNotation = (_env: string): void => {
    let notation: string | undefined = getJobTimingNotation(fulljobname);
    if (!notation) {
      notation = _env;
    }

    setSelectedTiming(notation);
  };

  useEffect(() => {
    displayInfo();
    setNotation(env);
  }, [jobname]);

  const renderComponent = () => {
    return allowed ? (
      <div>
        <div>
          <div className="block space-y-2 mt-3">
            <div id="jobsettings" className="grid grid-cols-[35%_60%]">
              <div className="flex items-center">
                <label>{jobname}</label>
              </div>
              <div className="flex items-center">
                <select
                  value={selectedTiming}
                  // value={selectedTaskFunction?.id.toString()}
                  className="select select-sm w-12/12"
                  onChange={(e) => handleTiming(e.target.value)}
                >
                  {/* <option disabled>Select a timeout</option> */}
                  {getJobTimings().map((timinggroup: tTimingGroup) => {
                    return (
                      <TimingGroup
                        key={timinggroup.group}
                        group={timinggroup}
                      />
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  };

  return <>{renderComponent()}</>;
};

export default SetupJob;
