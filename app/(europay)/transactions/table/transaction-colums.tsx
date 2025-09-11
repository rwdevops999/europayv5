"use client";

import { tTransactionData } from "@/app/server/data/transaction-data";
import { DataTableColumnHeader } from "@/ui/datatable/data-table-column-header";
import ProgressLink from "@/ui/progress-link";
import { ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";

const renderLink = (
  _id: number,
  _str: string
  // _user: tUser,
  // _iamactions: string[]
): ReactNode => {
  // const uselink: boolean = _user && $iam_user(_iamactions, _user);
  const uselink: boolean = true;
  return (
    <>
      {uselink && (
        <div className="ml-3 flex items-center h-[8px]">
          <div className="underline text-blue-400">
            <ProgressLink href={`/transactions/id=${_id}`}>{_str}</ProgressLink>
          </div>
        </div>
      )}
      {!uselink && (
        <div className="ml-3 flex items-center h-[8px] underline text-blue-400">
          {_str}
        </div>
      )}
    </>
  );
};

export const initialTableState = {
  pagination: {
    pageIndex: 0, //custom initial page index
    pageSize: 15, //custom default page size
  },
};

export const columns: ColumnDef<tTransactionData>[] = [
  {
    accessorKey: "transactionId",

    size: 200,

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction ID" />
    ),

    cell: ({ table, row, getValue }) => {
      return renderLink(
        row.original.id,
        getValue<string>()
        // table.options.meta?.user,
        // ["GetTtransaction"]
      );
    },

    footer: (props) => props.column.id,
  },
  {
    accessorKey: "sender",

    size: 575,

    header: ({ column }) => (
      <DataTableColumnHeader
        className="-ml-1.5"
        column={column}
        title="Sender"
      />
    ),

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
    accessorKey: "receiver",

    size: 575,

    header: ({ column }) => (
      <DataTableColumnHeader
        className="-ml-1.5"
        column={column}
        title="Receiver"
      />
    ),

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
    accessorKey: "amount",

    size: 175,

    header: ({ column }) => (
      <DataTableColumnHeader className="-ml-2" column={column} title="Amount" />
    ),

    cell: ({ row, getValue }) => {
      return <div>{getValue<string>()}</div>;
    },

    footer: (props) => props.column.id,
  },
];
