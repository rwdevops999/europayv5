"use client";

import { Data } from "@/lib/types";
import { DataTable } from "@/ui/datatable/data-table";
import { columns } from "./table/dialog-columns";
import { DataTableToolbar } from "./table/dialog-data-table-toolbar";
import { JSX, useEffect, useRef } from "react";
import { json } from "@/lib/util";
import { render } from "@testing-library/react";
import { ColumnDef } from "@tanstack/react-table";

const PolicyDataRenderer = ({
  data,
  columns,
  toolbar,
  selectedIds,
  changeSelection,
}: {
  data: Data[];
  columns: ColumnDef<Data>[];
  toolbar?: any;
  selectedIds: number[];
  changeSelection?: (_selection: number[]) => void;
}) => {
  const renderComponent = (): JSX.Element => {
    const handleSelectionChange = (selection: number[]): void => {
      const selectionSorted = selection.slice().sort();
      const equal: boolean =
        selectedIds.length === selection.length &&
        selectedIds
          .slice()
          .sort()
          .every(function (value, index) {
            return value === selectionSorted[index];
          });
      if (!equal && changeSelection) {
        changeSelection(selection);
      }
    };

    return (
      <div>
        <DataTable
          id="DataTablePolicyForm"
          data={data}
          columns={columns}
          Toolbar={toolbar}
          selectedItems={selectedIds}
          handleChangeSelection={handleSelectionChange}
          disablePageSizeChange={true}
        />
      </div>
    );
  };

  return <>{renderComponent()}</>;
};

export default PolicyDataRenderer;
