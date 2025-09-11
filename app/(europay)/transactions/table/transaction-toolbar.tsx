"use client";

import { TransactionStatus } from "@/generated/prisma";
import { DataTableFacetedFilter } from "@/ui/datatable/data-table-faceted-filter";
import { DataTableToolbarProps } from "@tanstack/react-table";

export function TransactionToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="ml-2 flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={[
              TransactionStatus.COMPLETED,
              TransactionStatus.PENDING,
              TransactionStatus.REJECTED,
            ]}
          />
        )}
      </div>
    </div>
  );
}
