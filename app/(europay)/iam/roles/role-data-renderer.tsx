import { Data } from "@/lib/types";
import { DataTable } from "@/ui/datatable/data-table";
import { JSX } from "react";
import { ColumnDef } from "@tanstack/react-table";

const RoleDataRenderer = ({
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
          id="DataTableRoleForm"
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

export default RoleDataRenderer;
