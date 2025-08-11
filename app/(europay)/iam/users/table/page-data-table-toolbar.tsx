"use client";

import { DataTableToolbarProps, Table } from "@tanstack/react-table";
import { CiFilter } from "react-icons/ci";

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
