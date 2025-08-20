import { JobData } from "@/app/server/data/job-data";
import { DataTableColumnHeader } from "@/ui/datatable/data-table-column-header";
import IndeterminateCheckbox from "@/ui/indeterminate-checkbox";
import { ColumnDef } from "@tanstack/react-table";

export const initialTableState = {
  pagination: {
    pageIndex: 0, //custom initial page index
    pageSize: 10, //custom default page size
  },
};

export const columns: ColumnDef<JobData>[] = [
  {
    accessorKey: "id",

    header: ({ column, header, table }) => <>ID</>,

    cell: ({ row, getValue }) => {
      {
        row.original.jobId;
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
    accessorKey: "jobid",

    size: 50,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" className="-ml-1.5" />
    ),

    cell: ({ row, getValue }) => {
      return (
        <div>
          <div className="flex items-center h-[10px]">{row.original.jobId}</div>
        </div>
      );
    },

    footer: (props) => props.column.id,
  },
  {
    accessorKey: "name",

    size: 200,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Job" className="-ml-1.5" />
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

    size: 600,

    enableSorting: false,

    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Description"
        className="-ml-2.5"
      />
    ),

    cell: ({ row, getValue }) => {
      return (
        <div>
          <div className="flex items-center h-[10px]">
            {row.original.description}
          </div>
        </div>
      );
    },

    footer: (props) => props.column.id,
  },
  {
    accessorKey: "status",

    size: 300,

    enableSorting: false,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),

    cell: ({ row, getValue }) => {
      return (
        row.depth === 0 && (
          <div className="badge badge-neutral badge-sm ml-2">
            {row.original.status}
          </div>
        )
      );
    },

    filterFn: (row, id, value) => {
      let included: boolean = true;

      if (row) {
        included = value.includes(row.original.status);
      }

      return included;
    },

    footer: (props) => props.column.id,
  },
  {
    accessorKey: "model",

    size: 300,

    enableSorting: false,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Model" />
    ),

    cell: ({ row, getValue }) => {
      return (
        row.depth === 0 && (
          <div className="badge badge-neutral badge-sm ml-2">
            {row.original.model}
          </div>
        )
      );
    },

    filterFn: (row, id, value) => {
      let included: boolean = true;

      if (row) {
        included = value.includes(row.original.model);
      }

      return included;
    },

    footer: (props) => props.column.id,
  },
];
