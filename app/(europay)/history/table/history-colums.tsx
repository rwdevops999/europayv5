import { tHistoryData } from "@/lib/types";
import { cn } from "@/lib/util";
import { DataTableColumnHeader } from "@/ui/datatable/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<tHistoryData>[] = [
  {
    accessorKey: "title",

    size: 250,

    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="History"
        className="ml-0.5"
      />
    ),

    cell: ({ row, getValue }) => {
      return (
        <div className="flex items-center h-[10px] ml-4">
          {getValue<string>()}
        </div>
      );
    },

    footer: (props) => props.column.id,
  },
  {
    accessorKey: "type",

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),

    size: 220,

    cell: ({ row, getValue }) => {
      return (
        <div className="flex items-center h-[10px]">
          <div
            className={cn(
              "badge badge-xs badge-neutral ml-2 flex justify-center border border-foreground/30 w-14",
              { "text-blue-500": row.original.type === "info" },
              { "text-red-500": row.original.type === "action" }
            )}
          >
            {getValue<string>()}
          </div>
        </div>
      );
    },

    filterFn: (row, id, value) => {
      let included: boolean = true;

      if (row) {
        included = row.original.type.includes(value);
      }

      return included;
    },

    footer: (props) => props.column.id,
  },
  {
    accessorKey: "description",

    size: 600,

    enableSorting: false,

    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Description"
        className="-ml-3"
      />
    ),

    cell: ({ row, getValue }) => {
      return (
        <div className="flex items-center h-[10px]">{getValue<string>()}</div>
      );
    },

    footer: (props) => props.column.id,
  },
  {
    accessorKey: "originator",

    size: 250,

    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Originator"
        className="-ml-[7px]"
      />
    ),

    cell: ({ row, getValue }) => {
      return (
        <div className="flex items-center h-[10px]">{getValue<string>()}</div>
      );
    },

    footer: (props) => props.column.id,
  },
  {
    accessorKey: "date",

    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created"
        className="-ml-[7px]"
      />
    ),

    size: 250,

    cell: ({ row, getValue }) => {
      const date: string = getValue<string>();

      return (
        <div className="flex items-center h-[10px]">{getValue<string>()}</div>
      );
    },

    footer: (props) => props.column.id,
  },
];
