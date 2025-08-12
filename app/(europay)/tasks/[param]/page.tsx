import React from "react";
import TaskHandler from "./task-handler";
import { isNumber, splitURLParams } from "@/lib/util";

export const dynamic = "force-dynamic";

const TaskWithId = async ({
  params,
}: {
  params: Promise<{ param: string }>;
}) => {
  const { param } = await params;

  let taskId: number | undefined;
  let depth: number;

  /**
   * parse URL parameters
   *
   * @param _param : the url param string
   */
  const parseURLParams = (_param: string) => {
    const params: Record<string, string> = splitURLParams(_param);

    if (isNumber(params["id"])) {
      taskId = parseInt(params["id"]) as number;
    }

    if (isNumber(params["depth"])) {
      depth = parseInt(params["depth"]) as number;
    } else {
      depth = 0;
    }
  };

  parseURLParams(param);

  const renderComponent = () => {
    return <TaskHandler taskId={taskId} depth={depth} />;
  };

  return <>{renderComponent()}</>;
};

export default TaskWithId;
