import { Data } from "@/app/lib/types";
import { cn } from "@/app/lib/util";
import Button from "@/app/ui/button";
import { DataTableColumnHeader } from "@/app/ui/datatable/data-table-column-header";
import { DataTableRowActions } from "@/app/ui/datatable/data-table-row-actions";
import IndeterminateCheckbox from "@/app/ui/indeterminate-checkbox";
import { ColumnDef } from "@tanstack/react-table";

export const columnsRoles: ColumnDef<Data>[] = [
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

    size: 414,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" className="-ml-1.5" />
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
  {
    accessorKey: "description",

    size: 610,

    enableSorting: false,

    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Description"
        className="-ml-3"
      />
    ),

    cell: ({ row, getValue }) => {
      return row.depth === 0 ? (
        <div
          style={{
            paddingLeft: `${row.depth * 4}rem`,
          }}
        >
          {row.original.description}
        </div>
      ) : null;
    },

    footer: (props) => props.column.id,
  },
];
