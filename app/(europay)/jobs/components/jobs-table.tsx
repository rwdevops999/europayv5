"use client";

import { JobData } from "@/app/server/data/job-data";
import { loadJobs } from "@/app/server/job";
import { useJob } from "@/hooks/use-job";
import { tJob } from "@/lib/prisma-types";
import { json } from "@/lib/util";
import { DataTable } from "@/ui/datatable/data-table";
import React, { useEffect, useState } from "react";
import { columns, initialTableState } from "../table/job-columns";
import { DataTableToolbar } from "../table/job-data-table-toolbar";
import { mapJobs } from "@/app/client/mapping";

const JobsTable = ({
  _jobs,
  selectedJobs,
  changeJobSelection,
}: {
  _jobs: tJob[];
  selectedJobs: number[];
  changeJobSelection?: (selection: number[]) => void;
}) => {
  const [tableData, setTableData] = useState<JobData[]>([]);

  useEffect(() => {
    console.log("[JobsTable]:UE[jobCount]:1", json(_jobs));
    setTableData(mapJobs(_jobs));
    console.log("[JobsTable]:UE[jobCount]:2", json(selectedJobs));
    setSelectedJobIds(selectedJobs);
  }, [_jobs, selectedJobs]);

  const [selectedJobIds, setSelectedJobIds] = useState<number[]>([]);

  const handleSelectionChange = (selection: number[]): void => {
    console.log("[JobsTable]:handleSelectionChange", json(selection));

    const equal: boolean =
      selection.length === selectedJobIds.length &&
      selectedJobIds.every(function (value, index) {
        return value === selection[index];
      });

    console.log("EQUAL", equal);
    if (!equal) {
      setSelectedJobIds(selection);
      if (changeJobSelection) {
        console.log(
          "[JobsTable]:handleSelectionChange",
          "NOTICE PARENT",
          selection.length
        );
        changeJobSelection(selection);
      }
    }
  };

  return (
    <DataTable
      id="JobsTable"
      data={tableData}
      columns={columns}
      Toolbar={DataTableToolbar}
      initialState={initialTableState}
      selectedItems={selectedJobIds}
      handleChangeSelection={handleSelectionChange}
    />
  );
};

export default JobsTable;
