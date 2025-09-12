import AppLink from "@/app/(europay)/ui/navigation/components/app-link";
import { cn } from "@/lib/util";
import { Data } from "@/lib/types";
import Button from "@/ui/button";
import { DataTableColumnHeader } from "@/ui/datatable/data-table-column-header";
import { DataTableRowActions } from "@/ui/datatable/data-table-row-actions";
import { ColumnDef } from "@tanstack/react-table";

export const initialTableState = {
  pagination: {
    pageIndex: 0, //custom initial page index
    pageSize: 15, //custom default page size
  },
};

export const columns: ColumnDef<Data>[] = [
  {
    accessorKey: "name",

    size: 480,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Policy" className="ml-5" />
    ),

    cell: ({ row, getValue }) => {
      return (
        <div style={{ paddingLeft: `${row.depth * 4}rem` }}>
          <div className="flex items-center h-[10px]">
            {row.depth === 0 &&
            row.original.children &&
            row.original.children.length > 0 ? (
              <>
                {row.original.extra?.system
                  ? "⛔"
                  : row.original.extra?.managed
                  ? "Ⓜ️"
                  : ""}
                <Button
                  name={row.getIsExpanded() ? "📭" : "📬"}
                  size="small"
                  // variant="ghost"
                  className={cn(
                    "border-0 hover:bg-transparent",
                    row.original.extra?.managed ? "ml-1" : "ml-4"
                  )}
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                  }}
                />
                {row.original.name}
              </>
            ) : row.depth === 1 ? (
              <>
                <AppLink
                  className="text-blue-400 underline"
                  href={`http://localhost:3000/iam/statements/id=${row.original.id}`}
                >
                  {row.original.name}
                </AppLink>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      );
    },

    filterFn: (row, id, value) => {
      let included: boolean = true;

      if (row) {
        included = row.original.name.includes(value);

        if (row.original.extra && row.original.extra.parent) {
          included = included || row.original.extra.parent.includes(value);
        }
      }

      return included;
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

    size: 720,

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
  {
    id: "actions",

    size: 100,

    enableSorting: false,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" className="-ml-3" />
    ),

    cell: ({ table, row }) => {
      return (
        <div className="flex items-center h-[10px]">
          {row.depth === 0 && <DataTableRowActions row={row} table={table} />}
        </div>
      );
    },
  },
];
