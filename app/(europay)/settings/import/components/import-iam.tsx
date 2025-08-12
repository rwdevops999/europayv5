"use client";

import { IamData } from "@/app/server/data/exportdata";
import { loadExportedData, loadExportNames } from "@/app/server/export";
import { importIamData } from "@/app/server/import";
import { JsonValue } from "@/generated/prisma/runtime/library";
import { json } from "@/lib/util";
import Button from "@/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { BsDatabaseFillAdd } from "react-icons/bs";
import { MdManageAccounts } from "react-icons/md";

const ImportIam = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  const [exportNames, setExportNames] = useState<string[]>([]);

  const loadTheExportNames = async (): Promise<void> => {
    setExportNames(["select name", ...(await loadExportNames())]);
  };

  useEffect(() => {
    loadTheExportNames();
  }, []);

  const importDone = (): void => {
    setLoaded(false);
    setEnabled(true);
  };

  const importFromDB = async (): Promise<void> => {
    const data: JsonValue | null = await loadExportedData(selectedExportName);

    if (data) {
      const _data: IamData = data as IamData;
      await importIamData(_data).then(() => importDone());
    }
  };

  const importData = (): void => {
    setLoaded(true);
    setEnabled(false);
    importFromDB();
  };

  const [selectedExportName, setSelectedExportName] =
    useState<string>("select name");

  const handleSetExportName = (event: any): void => {
    setSelectedExportName(event.target.value);
    setEnabled(true);
  };

  return (
    <div className="">
      <div className="grid grid-cols-[50%_20%_20%] items-center">
        <div>
          <select
            value={selectedExportName}
            className="ml-1 select h-7 block text-sm rounded-lg bg-base text-base-content w-[90%]"
            onChange={(e) => handleSetExportName(e)}
          >
            {exportNames.map((value: string) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>
        <div>
          <Button
            size="small"
            name="Import"
            icon={<MdManageAccounts />}
            iconFirst
            className="bg-custom"
            onClick={importData}
            disabled={!enabled}
          />
        </div>
        <div className="ml-10">{loaded && <BsDatabaseFillAdd />}</div>
      </div>
    </div>
  );
};

export default ImportIam;
