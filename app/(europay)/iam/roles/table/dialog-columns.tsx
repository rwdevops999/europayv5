import { Data } from "@/lib/types";
import { DataTableColumnHeader } from "@/ui/datatable/data-table-column-header";
import IndeterminateCheckbox from "@/ui/indeterminate-checkbox";
import { ColumnDef } from "@tanstack/react-table";

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

    size: 324,

    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Policies"
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
  {
    accessorKey: "service",

    size: 180,

    enableSorting: false,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service" />
    ),

    cell: ({ row, getValue }) => {
      return (
        row.depth === 0 && (
          <div className="badge badge-neutral badge-sm ml-2">
            {row.original.extra?.servicename}
          </div>
        )
      );
    },

    footer: (props) => props.column.id,
  },
  {
    accessorKey: "description",

    size: 520,

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
