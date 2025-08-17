import { JobModel, JobStatus } from "@/generated/prisma";
import { DataTableFacetedFilter } from "@/ui/datatable/data-table-faceted-filter";
import { DataTableToolbarProps } from "@tanstack/react-table";
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
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={[
              JobStatus.CREATED,
              JobStatus.RUNNING,
              JobStatus.COMPLETED,
              JobStatus.SUSPENDED,
            ]}
          />
        )}
        {table.getColumn("model") && (
          <DataTableFacetedFilter
            column={table.getColumn("model")}
            title="Model"
            options={[JobModel.CLIENT, JobModel.SERVER]}
          />
        )}
      </div>
    </div>
  );
}
