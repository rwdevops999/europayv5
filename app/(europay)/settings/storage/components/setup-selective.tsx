"use client";

import { $iam_user_has_action } from "@/app/client/iam-access";
import { cleanDbTables } from "@/app/server/app-tables";
import { useUser } from "@/hooks/use-user";
import { json } from "@/lib/util";
import Button from "@/ui/button";
import { JSX, useState } from "react";
import { IoWarningSharp } from "react-icons/io5";

type selective = {
  name: string;
  clear: boolean;
};

// these values need to be the same as the logistics tables (in setup.ts) when converted to lowercase
const selectiveTables: Record<string, boolean> = {
  History: false,
  Jobs: false,
  OTP: false,
  Settings: false,
  Tasks: false,
  Templates: false,
};

const tooltips: Record<string, string> = {
  Jobs: "Attention! This can remove running jobs.",
  OTP: "Attention! This can clear active OTP's.",
  Tasks: "Attention! This can remove uncompleted tasks.",
  Templates: "Attention! This will remove all templates.",
};

const SetupSelective = () => {
  const { user } = useUser();

  const [selected, setSelected] =
    useState<Record<string, boolean>>(selectiveTables);

  const handleChangeTableSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    _table: string
  ): void => {
    const checked: boolean = event.target.checked;

    selectiveTables[_table] = checked;
    setSelected({ ...selectiveTables });
  };

  const RenderTableSelect = ({ _table }: { _table: string }): JSX.Element => {
    return (
      <div className="flex items-center space-x-2">
        <label className="label text-sm">
          <input
            type="checkbox"
            checked={selectiveTables[_table]}
            className="checkbox checkbox-xs rounded-sm"
            onChange={(e) => handleChangeTableSelect(e, _table)}
          />
          {_table}
        </label>
        <div>
          {tooltips[_table] && (
            <div
              className="tooltip tooltip-warning"
              data-tip={tooltips[_table]}
            >
              <IoWarningSharp size={16} color="#f60" />
            </div>
          )}
        </div>
      </div>
    );
  };

  const resetAll = (): void => {
    Object.keys(selectiveTables).forEach(
      (value: string) => (selectiveTables[value] = false)
    );

    setSelected(selectiveTables);
  };

  const clearSelection = async (): Promise<void> => {
    const tables: string[] = Object.entries(selectiveTables).reduce<string[]>(
      (acc: string[], value: any) => {
        const table: string = value[0];

        if (value[1] && !acc.includes(table)) {
          acc.push(table.toLocaleLowerCase());
        }
        return acc;
      },
      []
    );

    await cleanDbTables(tables, false);
    resetAll();
  };

  const allowTableSelect: boolean = $iam_user_has_action(
    user,
    "europay:settings:storage:tables",
    "Select Tables"
  );

  return allowTableSelect ? (
    <div className="block space-y-1">
      {Object.keys(selected).map((value: string) => (
        <div key={value}>
          <RenderTableSelect _table={value} />
        </div>
      ))}
      <div className="mt-5 flex items-center justify-start">
        <Button
          name="Clear selected"
          className="bg-ep-button w-[50%]"
          size="small"
          onClick={clearSelection}
          disabled={
            !$iam_user_has_action(
              user,
              "europay:settings:storage:tables",
              "Clear Tables"
            )
          }
        />
      </div>
    </div>
  ) : null;
};

export default SetupSelective;
