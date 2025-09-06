import { Table } from "@tanstack/react-table";
import {
  MdKeyboardDoubleArrowLeft,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import Button from "../button";

export const paginationSizes = [2, 3, 5, 10, 15];

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  showSelectInfo?: boolean;
  disablePageSizeChange?: boolean;
}

export const DataTablePagination = <TData extends unknown>({
  table,
  showSelectInfo = false,
  disablePageSizeChange = false,
}: DataTablePaginationProps<TData>) => {
  return (
    // <div className="flex items-center justify-end px-2">
    <div className="w-[92.5%] h-8">
      <div className="flex justify-end px-2">
        {showSelectInfo && (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
        )}
        {!showSelectInfo && (
          <div className="flex-1 text-sm text-muted-foreground"></div>
        )}
        <div className="flex items-center space-x-6 lg:space-x-8">
          {!disablePageSizeChange && (
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-foreground mr-2">Rows</p>
              <select
                className="select select-sm"
                value={`${table.getState().pagination.pageSize}`}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
              >
                {paginationSizes.map((pageSize) => (
                  <option key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
          )}
          {disablePageSizeChange && <div></div>}

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1}
            {table.getPageCount() === 0
              ? ` of ${table.getState().pagination.pageIndex + 1}`
              : ` of ${table.getPageCount()}`}
          </div>

          <div className="flex items-center space-x-1">
            <Button
              size={"extrasmall"}
              className="hover:bg-base-content/30"
              icon={<MdKeyboardDoubleArrowLeft size={16} />}
              disabled={!table.getCanPreviousPage()}
              onClick={() => {
                table.setPageIndex(0);
              }}
              type="button"
            />
            <Button
              size={"extrasmall"}
              className="hover:bg-base-content/30"
              icon={<MdOutlineKeyboardArrowLeft size={16} />}
              disabled={!table.getCanPreviousPage()}
              onClick={() => {
                table.previousPage();
              }}
              type="button"
            />
            <Button
              size={"extrasmall"}
              className="hover:bg-base-content/30"
              icon={<MdOutlineKeyboardArrowRight size={16} />}
              disabled={!table.getCanNextPage()}
              onClick={() => {
                table.nextPage();
              }}
              type="button"
            />
            <Button
              size={"extrasmall"}
              className="hover:bg-base-content/30"
              icon={<MdOutlineKeyboardDoubleArrowRight size={16} />}
              disabled={!table.getCanNextPage()}
              onClick={() => {
                table.setPageIndex(table.getPageCount() - 1);
              }}
              type="button"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
