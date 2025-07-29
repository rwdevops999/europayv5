import "@tanstack/react-table";
import { tUser } from "./types/prisma-types";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    handleAction?: (action: string, id: any) => void;
    //   title?: string;
    //   user?: tUser;
  }

  // interface ColumnMeta<TData, TValue> {
  //   title: string;
  // }

  interface DataTableToolbarProps<TData> {
    table: Table<TData>;
  }
}
