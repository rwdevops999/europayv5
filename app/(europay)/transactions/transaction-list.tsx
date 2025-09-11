"use client";

import { mapTransactions } from "@/app/client/mapping";
import { tTransactionData } from "@/app/server/data/transaction-data";
import { tTransaction } from "@/lib/prisma-types";
import { absoluteUrl } from "@/lib/util";
import { DataTable } from "@/ui/datatable/data-table";
import PageContent from "@/ui/page-content";
import { useEffect, useState } from "react";
import { columns, initialTableState } from "./table/transaction-colums";
import { TableMeta } from "@tanstack/react-table";
import { TransactionToolbar } from "./table/transaction-toolbar";

const TransactionList = ({
  transactions,
}: {
  transactions: tTransaction[];
}) => {
  const [tableData, setTableData] = useState<tTransactionData[]>([]);

  const mapTheTransactions = (
    _transactions: tTransaction[]
  ): tTransactionData[] => {
    return mapTransactions(_transactions);
  };

  useEffect(() => {
    setTableData(mapTheTransactions(transactions));
  }, [transactions]);

  const tableMeta: TableMeta<tTransactionData[]> = {
    // user: user,
  };

  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Transactions", url: absoluteUrl("/transactions") },
      ]}
    >
      <div id="tasks" className="w-[99vw] h-[84vh]">
        <div>
          <DataTable
            data={tableData}
            columns={columns}
            tablemeta={tableMeta}
            initialState={initialTableState}
            Toolbar={TransactionToolbar}
          />
        </div>
      </div>
    </PageContent>
  );
};

export default TransactionList;
