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
    setTableData(mapJobs(_jobs));
    setSelectedJobIds(selectedJobs);
  }, [_jobs, selectedJobs]);

  const [selectedJobIds, setSelectedJobIds] = useState<number[]>([]);

  const handleSelectionChange = (selection: number[]): void => {
    const equal: boolean =
      selection.length === selectedJobIds.length &&
      selectedJobIds.every(function (value, index) {
        return value === selection[index];
      });

    if (!equal) {
      setSelectedJobIds(selection);
      if (changeJobSelection) {
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
