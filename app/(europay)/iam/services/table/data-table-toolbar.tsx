"use client";

import { DataTableToolbarProps } from "@tanstack/react-table";
import { CiFilter } from "react-icons/ci";

export const STATUS_VALUES: string[] = ["status1", "status2"];

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const handleChangeEvent = (e: any) => {
    table.getColumn("name")!.setFilterValue(e.target.value);
  };

  return (
    <div className="ml-2 flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <label className="input">
          <CiFilter />
          <input
            type="search"
            className="input-xs"
            placeholder="Filter..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(e) => handleChangeEvent(e)}
          />
        </label>
      </div>
    </div>
  );
}
