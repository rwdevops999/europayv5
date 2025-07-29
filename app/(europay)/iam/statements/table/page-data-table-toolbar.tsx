"use client";

import { Permission } from "@/generated/prisma";
import { DataTableFacetedFilter } from "@/ui/datatable/data-table-faceted-filter";
import { DataTableToolbarProps, Table } from "@tanstack/react-table";
import { CiFilter } from "react-icons/ci";

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

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
        {table.getColumn("name") && (
          <DataTableFacetedFilter
            column={table.getColumn("access")}
            title="Access"
            options={[Permission.ALLOW, Permission.DENY]}
          />
        )}
      </div>
    </div>
  );
}
