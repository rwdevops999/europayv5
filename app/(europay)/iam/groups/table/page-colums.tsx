import AppLink from "@/app/(europay)/ui/navigation/components/app-link";
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

    size: 380,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" className="ml-4" />
    ),

    cell: ({ row, getValue }) => {
      return (
        <div style={{ paddingLeft: `${row.depth * 1}rem` }}>
          <div className="grid grid-cols-[2%_2%_2%_94%]">
            <div className="col-start-2">
              {row.original.extra?.managed && row.depth === 0 ? "Ⓜ️" : ""}
            </div>
            <div className="col-start-3">
              {row.depth === 0 &&
              row.original.children &&
              row.original.children.length > 0 ? (
                <Button
                  name={row.getIsExpanded() ? "📭" : "📬"}
                  size="small"
                  className="-mt-2 border-0 hover:bg-transparent"
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                  }}
                />
              ) : null}
            </div>
            <div className="col-start-4 ml-6">
              {row.original.extra?.subject === "Policy" && (
                <div className="flex items-center space-x-2">
                  <label>🇵</label>
                  <AppLink
                    className="text-blue-400 underline"
                    href={`http://localhost:3000/iam/policies/id=${row.original.id}`}
                  >
                    {row.original.name}
                  </AppLink>
                </div>
              )}
              {row.original.extra?.subject === "Role" && (
                <div className="flex items-center space-x-2">
                  <label>🇷</label>
                  <AppLink
                    className="text-blue-400 underline"
                    href={`http://localhost:3000/iam/roles/id=${row.original.id}`}
                  >
                    {row.original.name}
                  </AppLink>
                </div>
              )}
              {row.original.extra?.subject === "User" && (
                <div className="flex items-center space-x-2">
                  <label>🇺</label>
                  <AppLink
                    className="text-blue-400 underline"
                    href={`http://localhost:3000/iam/users/id=${row.original.id}`}
                  >
                    {row.original.name}
                  </AppLink>
                </div>
              )}
              {row.original.extra?.subject === "Group" && (
                <>{row.original.name}</>
              )}
            </div>
          </div>
        </div>
      );
    },

    footer: (props) => props.column.id,
  },
  {
    accessorKey: "description",

    enableSorting: false,

    size: 1020,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),

    cell: ({ row, getValue }) => {
      return (
        <div className="ml-3">
          <div className="flex items-center h-[10px]">
            {row.depth === 0 && <div>{row.original.description}</div>}
          </div>
        </div>
      );
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
