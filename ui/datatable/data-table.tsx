"use client";

/**
 * Data  table
 */

import { ComponentType, useEffect, useRef, useState } from "react";
import {
  DataTableToolbarProps,
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  RowSelectionState,
  SortingState,
  TableMeta,
  useReactTable,
  PaginationState,
  InitialTableState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table/table";
import { DataTablePagination } from "./data-table-pagination";
import { json } from "@/lib/util";

export interface IDataSubRows<TData> {
  id?: number;
  children?: any[];
}

let initPhase: boolean = true;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  tablemeta?: TableMeta<TData>;
  Toolbar?: ComponentType<DataTableToolbarProps<TData>>;
  readonly rowSelecting?: boolean;
  readonly handleChangeSelection?: (selection: number[]) => void;
  expandAll?: boolean;
  enableRowSelection?: boolean;
  selectedItems?: (number | undefined)[];
  id?: string;
  initialState?: InitialTableState;
  disablePageSizeChange?: boolean;
}

export function DataTable<TData extends IDataSubRows<TData>, TValue>({
  columns,
  data,
  tablemeta,
  Toolbar,
  rowSelecting = true,
  handleChangeSelection = (selection: number[]) => {},
  expandAll = false,
  enableRowSelection = true,
  selectedItems,
  id = "",
  initialState,
  disablePageSizeChange = false,
}: DataTableProps<TData, TValue>) {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({
    id: false,
  });

  /**
   * TABLE INSTANCE
   */
  const table = useReactTable({
    columns: columns,
    data: data,
    state: {
      expanded,
      columnFilters,
      rowSelection,
      sorting,
      columnVisibility,
    },

    initialState: initialState ?? {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 5, //custom default page size
      },
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.children,
    getCoreRowModel: getCoreRowModel(),
    meta: tablemeta,
    getExpandedRowModel: getExpandedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    filterFromLeafRows: true,
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: enableRowSelection && ((row) => row.depth === 0),
    enableSubRowSelection: false,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    enableSortingRemoval: false,
  });

  // useEffect(() => {
  //   if (selectedItems.length > 0) {
  //     let state: Record<string, boolean> = {};
  //     selectedItems.map((item: number | undefined) => {
  //       if (item) {
  //         const row: Row<TData> | undefined = Object.values(
  //           table.getRowModel().rowsById
  //         ).find((row: Row<TData>) => row.original.id === item);
  //         if (row) {
  //           state[row.id] = true;
  //         }
  //       }
  //     });

  //     if (data.length > 0) {
  //       setRowSelection({ ...state });
  //     }
  //   }
  // }, [data]);

  let xrowSelection: RowSelectionState = {};

  useEffect(() => {
    if (selectedItems) {
      let selection: Record<string, boolean> = table
        .getCoreRowModel()
        .rows.reduce<Record<string, boolean>>(
          (acc: Record<string, boolean>, row: Row<TData>) => {
            if (selectedItems.includes(row.original.id)) {
              acc[row.id] = true;
            }

            return acc;
          },
          {}
        );

      xrowSelection = selection;

      setRowSelection(selection);
    }
  }, [selectedItems]);

  useEffect(() => {
    let selection: RowSelectionState = {};

    if (xrowSelection !== rowSelection) {
      if (Object.keys(xrowSelection).length === 0) {
        selection = rowSelection;
      } else {
        selection = xrowSelection;
      }
    }

    const selectedIds: string[] = Object.keys(selection).map(
      (key: string) => key
    );
    //   if (handleChangeSelection && data.length > 0) {
    // if (selectionType === "ids") {
    const itemIds: number[] = selectedIds.map((id: string) => {
      const row: Row<TData> = table.getRow(id);
      return row.original.id!;
    });

    handleChangeSelection(itemIds);
    //       handleChangeSelection(itemIds);
    //     } else {
    //       const items: Row<TData>[] = selectedIds.map((id: string) => {
    //         const row: Row<TData> = table.getRow(id);
    //         return row;
    //       });
    //       handleChangeSelection(items);
    //     }
    //   }
    // }
  }, [rowSelection]);

  useEffect(() => {
    if (expandAll) {
      setExpanded(true);
    }
  }, [expandAll]);

  const handleRowClick = (
    row: Row<TData>,
    event?: React.MouseEvent
  ): { row: Row<TData>; event?: React.MouseEvent } => {
    event?.stopPropagation();
    if (rowSelecting && row.getCanSelect()) {
      row.toggleSelected();
    }

    return { row, event };
  };

  const renderTable = () => {
    return (
      <div className="space-y-4">
        <div>{Toolbar && <Toolbar table={table} />}</div>
        <div>
          <Table
            {...{
              style: {
                width: table.getCenterTotalSize(),
              },
            }}
          >
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      onClick={(e) => handleRowClick(row, e)}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell
                            // className="h-2"
                            key={cell.id}
                            style={{ width: cell.column.getSize() }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination
          table={table}
          disablePageSizeChange={disablePageSizeChange}
        />
      </div>
    );
  };

  return <>{renderTable()}</>;
}
