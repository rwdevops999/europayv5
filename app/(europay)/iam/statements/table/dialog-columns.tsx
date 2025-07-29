import { Data } from "@/lib/types";
import { DataTableColumnHeader } from "@/ui/datatable/data-table-column-header";
import IndeterminateCheckbox from "@/ui/indeterminate-checkbox";
import { ColumnDef } from "@tanstack/react-table";

export const initialTableState = {
  pagination: {
    pageIndex: 0, //custom initial page index
    pageSize: 10, //custom default page size
  },
};

export const columns: ColumnDef<Data>[] = [
  {
    accessorKey: "id",

    header: ({ column, header, table }) => <>ID</>,

    cell: ({ row, getValue }) => {
      {
        row.original.id;
      }
    },
  },
  {
    id: "select",

    size: 50,

    header: ({ header, table }) => {
      return (
        <div className="w-1">
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        </div>
      );
    },

    cell: ({ row }) => (
      <div className="w-1">
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),

    enableSorting: false,
  },
  {
    accessorKey: "name",

    size: 1024,

    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actions"
        className="-ml-1.5"
      />
    ),

    cell: ({ row, getValue }) => {
      return (
        <div>
          <div className="flex items-center h-[10px]">{row.original.name}</div>
        </div>
      );
    },

    footer: (props) => props.column.id,
  },
];
