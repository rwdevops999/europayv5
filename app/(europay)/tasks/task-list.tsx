"use client";

import { mapTasks } from "@/app/client/mapping";
import { tTaskData } from "@/app/server/data/taskdata";
import { getUncompletedTasksCount } from "@/app/server/tasks";
import { useTask } from "@/hooks/use-task";
import { absoluteUrl } from "@/lib/util";
import { tTask } from "@/lib/prisma-types";
import { DataTable } from "@/ui/datatable/data-table";
import PageContent from "@/ui/page-content";
import { TableMeta } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { columns } from "./table/task-colums";
import { DataTableToolbar } from "./table/task-data-table-toolbar";
import { useUser } from "@/hooks/use-user";

const TaskList = ({ tasks }: { tasks: tTask[] }) => {
  const { user } = useUser();

  const { setTaskAvailable } = useTask();

  const [tableData, setTableData] = useState<tTaskData[]>([]);

  const checkForTasks = async (): Promise<void> => {
    const tasks: number = await getUncompletedTasksCount();
    setTaskAvailable(tasks > 0);
  };

  useEffect(() => {
    checkForTasks();
    setTableData(mapTasks(tasks));
  }, [tasks]);

  const tableMeta: TableMeta<tTaskData[]> = {
    user: user,
  };

  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Tasks", url: absoluteUrl("/tasks") },
      ]}
    >
      <div id="tasks" className="w-[99vw] h-[84vh]">
        <div>
          <DataTable
            data={tableData}
            columns={columns}
            Toolbar={DataTableToolbar}
            tablemeta={tableMeta}
          />
        </div>
      </div>
    </PageContent>
  );
};

export default TaskList;
