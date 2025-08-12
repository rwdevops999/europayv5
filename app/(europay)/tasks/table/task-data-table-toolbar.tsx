"use client";

import { DataTableToolbarProps, Table } from "@tanstack/react-table";
import { TaskStatus } from "@/generated/prisma";
import { DataTableFacetedFilter } from "@/ui/datatable/data-table-faceted-filter";

const TASK_STATUS_ANY: string[] = [
  TaskStatus.CREATED,
  TaskStatus.OPEN,
  TaskStatus.COMPLETE,
];

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="ml-2 flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={TASK_STATUS_ANY}
          />
        )}
      </div>
    </div>
  );
}
