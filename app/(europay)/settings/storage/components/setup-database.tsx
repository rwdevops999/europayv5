"use client";

import { $iam_user_has_action } from "@/app/client/iam-access";
import { cleanDbTables } from "@/app/server/app-tables";
import { dbResult } from "@/app/server/data/db-tables";
import {
  clearDatabaseTables,
  loadCountriesToDB,
  loadServicesToDB,
} from "@/app/server/setup";
import { useUser } from "@/hooks/use-user";
import Button from "@/ui/button";
import { Separator } from "@/ui/radix/separator";
import { useState } from "react";
import { BsDatabaseFillGear } from "react-icons/bs";

const SetupDatabase = () => {
  const { user } = useUser();

  const [provision, setProvision] = useState<boolean>(true);
  const [numServices, setNumServices] = useState<number>(0);
  const [numCountries, setNumCountries] = useState<number>(0);

  const handleProvisioningChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const checked: boolean = event.target.checked;

    setProvision(checked);
  };

  const clearFullDatabase = async (): Promise<void> => {
    const clearedValues: dbResult = await clearDatabaseTables(provision);

    setNumServices(clearedValues.nrOfservices);
    setNumCountries(clearedValues.nrOfcountries);
  };

  const clearWorkDatabase = async (): Promise<void> => {
    await cleanDbTables([
      "accounts",
      "accountApply",
      "exports",
      "groups",
      "policies",
      "roles",
      "servicestatements",
      "users",
    ]);
  };

  const loadServices = async (): Promise<void> => {
    setNumServices(await loadServicesToDB());
  };

  const loadCountries = async (): Promise<void> => {
    setNumCountries(await loadCountriesToDB());
  };

  const allowLoadServices: boolean = $iam_user_has_action(
    user,
    "europay:settings:storage:database",
    "Load Services"
  );
  const allowLoadCountries: boolean = $iam_user_has_action(
    user,
    "europay:settings:storage:database",
    "Load Countries"
  );
  const allowClearWorkingTables: boolean = $iam_user_has_action(
    user,
    "europay:settings:storage:database",
    "Clear Workdata"
  );
  const allowProvisionManual: boolean = $iam_user_has_action(
    user,
    "europay:settings:storage:database",
    "Provision"
  );
  const allowClearFullDatabase: boolean = $iam_user_has_action(
    user,
    "europay:settings:storage:database",
    "Clear Database"
  );

  return (
    <div>
      <div className="flex items-baseline space-x-2">
        <BsDatabaseFillGear size={20} />
        <label>Clean and setup database</label>
      </div>
      <div className="mt-5">
        <div id="clearfull" className="grid grid-cols-[60%_40%] space-y-2">
          <div>
            <Button
              name="Clear full database"
              className="bg-ep-button w-[80%]"
              size="small"
              onClick={clearFullDatabase}
              disabled={!allowClearFullDatabase}
            />
          </div>
          <div>
            <label className="label text-sm">
              <input
                type="checkbox"
                checked={provision}
                className="checkbox checkbox-xs rounded-sm"
                onChange={(e) => handleProvisioningChange(e)}
                disabled={!allowProvisionManual}
              />
              Provision data
            </label>
          </div>
        </div>
        <div id="clearwork" className="grid grid-cols-[60%_40%] space-y-2">
          <div>
            <Button
              name="Clear work data"
              className="bg-ep-button w-[80%]"
              size="small"
              disabled={!allowClearWorkingTables}
              onClick={clearWorkDatabase}
            />
          </div>
        </div>
        <Separator className="my-1" />
        <div id="loadstuff" className="grid grid-cols-[60%_40%] space-y-2">
          <div>
            <Button
              name={`Load services (${numServices})`}
              className="bg-ep-button w-[80%]"
              size="small"
              disabled={provision && !allowLoadServices}
              onClick={loadServices}
            />
          </div>
          <div />
          <div>
            <Button
              name={`Load countries (${numCountries})`}
              className="bg-ep-button w-[80%]"
              size="small"
              disabled={provision && !allowLoadCountries}
              onClick={loadCountries}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupDatabase;
