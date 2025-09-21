import { Data } from "@/lib/types";
import Button from "@/ui/button";
import { DataTableColumnHeader } from "@/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

export const initialTableState = {
  pagination: {
    pageIndex: 0, //custom initial page index
    pageSize: 12, //custom default page size
  },
};

export const columns: ColumnDef<Data>[] = [
  {
    accessorKey: "name",

    size: 1500,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service" className="ml-2" />
    ),

    cell: ({ row, getValue }) => {
      return (
        <div style={{ paddingLeft: `${row.depth * 1}rem` }}>
          <div className="flex items-center">
            {row.original.children && row.original.children?.length > 0 ? (
              <Button
                style="ghost"
                size={"extrasmall"}
                name={row.getIsExpanded() ? "📭" : "📬"}
                className="border-0 hover:bg-transparent"
                {...{
                  onClick: row.getToggleExpandedHandler(),
                }}
              />
            ) : (
              <Button
                style="ghost"
                size={"extrasmall"}
                name={"📬"}
                className="border-0 opacity-0 hover:cursor-default"
              />
            )}
            {row.original.name}
          </div>
        </div>
      );
    },

    footer: (props) => props.column.id,
  },
];
