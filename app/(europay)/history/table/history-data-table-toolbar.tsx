import { HistoryType } from "@/generated/prisma";
import { DataTableFacetedFilter } from "@/ui/datatable/data-table-faceted-filter";
import { DataTableToolbarProps, Table } from "@tanstack/react-table";
import { CiFilter } from "react-icons/ci";

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const handleChangeEvent = (e: any) => {
    table.getColumn("title")!.setFilterValue(e.target.value);
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
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(e) => handleChangeEvent(e)}
          />
        </label>
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={[HistoryType.INFO, HistoryType.ACTION]}
          />
        )}
      </div>
    </div>
  );
}
