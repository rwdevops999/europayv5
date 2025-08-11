"use client";

import {
  DATATABLE_ACTION_DELETE,
  DATATABLE_ACTION_UPDATE,
} from "@/lib/constants";
import { Data } from "@/lib/types";
import { Row, Table } from "@tanstack/react-table";
import { CiTrash } from "react-icons/ci";
import { GiPencil } from "react-icons/gi";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

export function DataTableRowActions<TData>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {
  const handleDelete = (event: React.MouseEvent) => {
    const statement: Data = row.original as Data;
    const meta = table.options.meta;
    meta && meta.handleAction
      ? meta.handleAction(DATATABLE_ACTION_DELETE, statement)
      : () => {};
    event.preventDefault();
    event.stopPropagation();
  };

  const handleUpdate = (event: React.MouseEvent) => {
    const statement: Data = row.original as Data;
    const meta = table.options.meta;
    meta && meta.handleAction
      ? meta.handleAction(DATATABLE_ACTION_UPDATE, statement)
      : () => {};
    event.preventDefault();
    event.stopPropagation();
  };

  const disableDelete: boolean = false;
  const disableUpdate: boolean = false;

  return (
    <div className="flex space-x-2">
      <CiTrash
        className={"cursor-pointer"}
        onClick={(e) => handleDelete(e)}
        // className={disableDelete ? "cursor-not-allowed" : "cursor-pointer"}
        // onClick={disableDelete ? NOOP : (e) => handleDelete(e)}
      />
      <GiPencil
        className={"cursor-pointer"}
        onClick={(e) => handleUpdate(e)}
        // className={disableDelete ? "cursor-not-allowed" : "cursor-pointer"}
        // onClick={disableUpdate ? NOOP : (e) => handleUpdate(e)}
      />
    </div>
  );
}
