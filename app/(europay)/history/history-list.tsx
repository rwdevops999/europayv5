"use client";

import { mapHistory } from "@/app/client/mapping";
import { tHistory } from "@/lib/prisma-types";
import { tHistoryData } from "@/lib/types";
import { absoluteUrl } from "@/lib/util";
import { DataTable } from "@/ui/datatable/data-table";
import PageContent from "@/ui/page-content";
import PageItemContainer from "@/ui/page-item-container";
import { useEffect, useState } from "react";
import { columns } from "./table/history-colums";
import { DataTableToolbar } from "./table/history-data-table-toolbar";

const HistoryList = ({ history }: { history: tHistory[] }) => {
  const [tableData, setTableData] = useState<tHistoryData[]>([]);

  useEffect(() => {
    setTableData(mapHistory(history));
  }, [history]);

  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "History", url: absoluteUrl("/history") },
      ]}
    >
      <div id="history" className="w-[98vw] h-[84vh] rounded-sm">
        <PageItemContainer title="history">
          <DataTable
            data={tableData}
            columns={columns}
            Toolbar={DataTableToolbar}
          />
        </PageItemContainer>
      </div>
    </PageContent>
  );
};

export default HistoryList;
