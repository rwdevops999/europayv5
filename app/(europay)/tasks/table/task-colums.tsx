"use client";

import { tTaskData } from "@/app/server/data/taskdata";
import { TaskStatus } from "@/generated/prisma";
import { cn } from "@/lib/util";
import { DataTableColumnHeader } from "@/ui/datatable/data-table-column-header";
import ProgressLink from "@/ui/progress-link";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";

const renderNormal = (_str: string, _icons: string[]): ReactNode => {
  return (
    <div className="-p-2 ml-3 flex items-center h-[8px]">
      {_str}
      <br />
      <div className="text-foreground ml-1">
        {_icons.map((_icon: string) => _icon)}
      </div>
    </div>
  );
};

const renderLink = (
  _id: number,
  _str: string,
  // _user: tUser,
  _icons: string[],
  _iamactions: string[]
): ReactNode => {
  // const uselink: boolean = _user && $iam_user(_iamactions, _user);
  const uselink: boolean = true;
  return (
    <>
      {uselink && (
        <div className="ml-3 flex items-center h-[8px]">
          <div className="underline text-blue-400">
            <ProgressLink href={`/tasks/id=${_id}&depth=0`}>
              {_str}
            </ProgressLink>
          </div>
          <div className="text-foreground ml-1">
            {_icons.map((_icon: string) => _icon)}
          </div>
        </div>
      )}
      {!uselink && (
        <div className="ml-3 flex items-center h-[8px] underline text-blue-400">
          {_str}
          <div className="text-foreground ml-1">
            {_icons.map((_icon: string) => _icon)}
          </div>
        </div>
      )}
    </>
  );
};

export const columns: ColumnDef<tTaskData>[] = [
  {
    accessorKey: "taskId",

    size: 200,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task ID" />
    ),

    cell: ({ table, row, getValue }) => {
      const isUncompleted: boolean =
        row.original.status === TaskStatus.CREATED ||
        row.original.status === TaskStatus.OPEN;

      return isUncompleted
        ? renderLink(
            row.original.id,
            getValue<string>(),
            // table.options.meta?.user,
            row.original.icons,
            ["GetTask"]
          )
        : renderNormal(getValue<string>(), row.original.icons);
    },

    footer: (props) => props.column.id,
  },
  {
    accessorKey: "description",

    size: 1150,

    header: ({ column }) => <div>Description</div>,

    cell: ({ row, getValue }) => {
      return (
        <div className="-p-2 flex items-center h-[8px]">
          {getValue<string>()}
        </div>
      );
    },

    footer: (props) => props.column.id,
  },
  {
    accessorKey: "status",

    size: 175,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),

    cell: ({ row, getValue }) => {
      return (
        <div
          className={cn(
            "flex items-center ml-3 h-[8px] ${statusColor}",
            {
              "text-status-created": getValue<string>() === TaskStatus.CREATED,
            },
            { "text-status-open": getValue<string>() === TaskStatus.OPEN },
            {
              "text-status-complete":
                getValue<string>() === TaskStatus.COMPLETE,
            }
          )}
        >
          {getValue<string>()}
        </div>
      );
    },

    filterFn: (row, id, value) => {
      return value.includes(row.original.status);
    },

    footer: (props) => props.column.id,
  },
];
