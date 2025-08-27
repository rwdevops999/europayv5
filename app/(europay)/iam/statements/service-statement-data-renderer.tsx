import { Data } from "@/lib/types";
import { DataTable } from "@/ui/datatable/data-table";
import { JSX, useEffect, useRef } from "react";
import { json } from "@/lib/util";
import { ColumnDef } from "@tanstack/react-table";

const ServiceStatementDataRenderer = ({
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
  useEffect(() => {
    console.log("[DataRenderer]", "useEffect[selectedIds]", json(selectedIds));
  }, [selectedIds]);

  const renderComponent = (): JSX.Element => {
    console.log("[DataRenderer]", "RENDER", json(selectedIds));

    const handleSelectionChange = (selection: number[]): void => {
      console.log("[DataRenderer]", "handleSelectionChange", json(selection));
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
          id="DataTableServiceStatementForm"
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

export default ServiceStatementDataRenderer;
