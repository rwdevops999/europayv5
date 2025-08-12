"use client";

import {
  taskFunctions,
  tTaskExecutionResult,
  tTaskFunction,
} from "@/app/server/data/taskdata";
import {
  executeTask,
  getUncompletedTasksCount,
  loadTaskById,
} from "@/app/server/tasks";
import { TaskStatus } from "@/generated/prisma";
import { useProgressBar } from "@/hooks/use-progress-bar";
import { useTask } from "@/hooks/use-task";
import { cn, padZero } from "@/lib/util";
import { tTask } from "@/lib/prisma-types";
import Button from "@/ui/button";
import ProgressLink from "@/ui/progress-link";
import { Separator } from "@/ui/radix/separator";
import TemplateAlert, { tAlert } from "@/ui/template-alert";
import { useRouter } from "next/navigation";
import { JSX, ReactNode, startTransition, useEffect, useState } from "react";
import { IoCalendarOutline } from "react-icons/io5";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TaskForm = ({
  taskId = 0,
  depth,
}: {
  taskId?: number;
  depth: number;
}) => {
  const { setTaskAvailable } = useTask();

  const [selectedTask, setSelectedTask] = useState<tTask | null>(null);

  const [selectedTaskFunction, setSelectedTaskFunction] = useState<
    tTaskFunction | undefined
  >(undefined);

  const processLoadedTask = (_task: tTask | null) => {
    setSelectedTask(_task);

    if (_task) {
      const taskFunction: tTaskFunction | undefined = taskFunctions[
        _task.name
      ].find(
        (_taskfunction: tTaskFunction) =>
          _taskfunction.onStatus === _task.status
      );

      if (taskFunction) {
        setSelectedTaskFunction(taskFunction);
      }
    }
  };

  const loadTheTask = async (_id: number): Promise<void> => {
    await loadTaskById(_id).then((task: tTask | null) => {
      processLoadedTask(task);
    });
  };

  useEffect(() => {
    loadTheTask(taskId);
  }, [taskId]);

  const Status = (_task: any): ReactNode => {
    return (
      <div className="flex items-center space-x-1">
        {_task && (
          <div
            className={cn(
              "badge badge-xs rounded-xl",
              { "bg-status-created": _task.status === TaskStatus.CREATED },
              { "bg-status-open": _task.status === TaskStatus.OPEN },
              { "bg-status-complete": _task.status === TaskStatus.COMPLETE }
            )}
          >
            {_task.status}
          </div>
        )}
      </div>
    );
  };

  const [alert, setAlert] = useState<tAlert | null>();

  const renderTaskId = (_task: tTask): ReactNode => {
    // const uselink: boolean = _user && $iam_user(_iamactions, _user);
    const uselink: boolean = true;

    const text: string = padZero(_task.id, 5, "TSK");

    if (_task.status !== TaskStatus.COMPLETE) {
      return (
        <>
          {uselink && (
            <div className="ml-3 flex items-center h-[8px]">
              <div className="underline text-link">
                <ProgressLink href={`/tasks/id=${_task.id}&depth=${depth + 1}`}>
                  {text}
                </ProgressLink>
              </div>
            </div>
          )}
          {!uselink && (
            <div className="ml-3 flex items-center h-[8px] underline text-link">
              {text}
            </div>
          )}
        </>
      );
    }

    return (
      <div className="-p-2 ml-3 flex items-center h-[8px]">
        {text}
        <br />
      </div>
    );
  };

  const TaskStatusSimple = (_task: any): ReactNode => {
    return (
      <div className="flex items-center space-x-1">
        {_task && (
          <div
            className={cn(
              "badge badge-xs rounded-xl",
              { "bg-status-created": _task.status === TaskStatus.CREATED },
              { "bg-status-open": _task.status === TaskStatus.OPEN },
              { "bg-status-complete": _task.status === TaskStatus.COMPLETE }
            )}
          >
            {_task.status}
          </div>
        )}
      </div>
    );
  };

  const renderLinked = (_icon: string, _task: any): ReactNode => {
    return (
      <div className="flex space-x-2 items-center">
        <div>{_icon}</div>
        <div>{renderTaskId(_task)}</div>
        <div>{TaskStatusSimple(_task)}</div>
        <div></div>
      </div>
    );
  };

  const TaskHeaderTitle = (): JSX.Element => {
    return (
      <div className="flex justify-between cursor-default">
        <div className="text-sm">Task</div>
        <div className="text-sm font-normal">
          {selectedTask &&
            selectedTask.predecessorTask &&
            renderLinked("🅿", selectedTask.predecessorTask!)}
        </div>
        <div className="text-sm">Status</div>
      </div>
    );
  };

  const TaskHeaderTitleData = (): JSX.Element => {
    return (
      <div className="flex justify-between items-center cursor-default">
        <div className="text-orange-400">
          {padZero(selectedTask ? selectedTask.id : 0, 5, "TSK")}
        </div>
        <div>
          {selectedTask &&
            selectedTask.successorTask &&
            renderLinked("🆂", selectedTask.successorTask!)}
        </div>
        <div>{Status(selectedTask)}</div>
      </div>
    );
  };

  const TaskHeader = (): JSX.Element => {
    return (
      <div className="w-[100%] min-h-[12%] border-none rounded-sm">
        <TaskHeaderTitle />
        <TaskHeaderTitleData />
      </div>
    );
  };

  const renderCreationDateInfo = (dateValue: string | undefined): string => {
    if (dateValue) {
      const date = new Date(dateValue);

      return (
        "created on: " +
        date.getDate() +
        " " +
        months[date.getMonth()] +
        " " +
        date.getFullYear() +
        " " +
        (date.getHours() - 1).toString().padStart(2, "0") +
        ":" +
        date.getMinutes().toString().padStart(2, "0")
      );
    }

    return "not known";
  };

  const TaskCreationDate = (): ReactNode => {
    return (
      <div className="mt-2 flex space-x-2 items-center">
        <IoCalendarOutline className="text-background/70 h-4 w-4 opacity-70" />
        <label className="text-sm text-background/70">
          {renderCreationDateInfo(selectedTask?.createDate!.toString())}
        </label>
      </div>
    );
  };

  const handleSelectTaskFunction = (value: string): void => {
    const id: number = parseInt(value);

    if (selectedTask) {
      const taskFunction: tTaskFunction | undefined = taskFunctions[
        selectedTask.name
      ].find((func: tTaskFunction) => func.id === id);

      if (taskFunction) {
        setSelectedTaskFunction(taskFunction);
      }
    }
  };

  const TaskContent = (): JSX.Element => {
    return (
      <div className="w-full min-h-[88%] border-none rounded-sm">
        <div className="block space-y-2">
          <TaskCreationDate />
          <div className="flex items-center space-x-5">
            <label>Action to take:</label>
            <label className="font-bold italic">{selectedTask?.name}</label>
          </div>
          <div className="flex items-start space-x-4">
            <label className="mt-1.5">Description:</label>
            <textarea
              className="textarea w-11/12 resize-none border-1 border-base-content/40"
              readOnly
              defaultValue={selectedTask?.description}
            ></textarea>
          </div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Actions</legend>
            <select
              value={selectedTaskFunction?.id.toString()}
              className="select select-sm w-12/12"
              onChange={(e) => handleSelectTaskFunction(e.target.value)}
            >
              <option disabled={true}>Select an action</option>
              {selectedTask &&
                taskFunctions[selectedTask.name].map(
                  (taskfunction: tTaskFunction) => (
                    <option
                      key={taskfunction.id}
                      value={taskfunction.id}
                    >{`${selectedTask.name} [${taskfunction.onStatus}]`}</option>
                  )
                )}
            </select>
          </fieldset>
        </div>
      </div>
    );
  };

  const Content = (): JSX.Element => {
    return (
      <div className="min-w-[100%] h-[100%]">
        <TaskHeader />
        <Separator />
        <TaskContent />
      </div>
    );
  };
  const handleCancelClick = (): void => {
    const dialog: HTMLDialogElement = document.getElementById(
      "taskdialog"
    ) as HTMLDialogElement;

    dialog.close();
    handleRedirect(false, depth);
  };

  const isTaskCompleted = (): boolean => {
    return selectedTask && selectedTask.status === TaskStatus.COMPLETE
      ? true
      : false;
  };

  const progress = useProgressBar();
  const { push, back } = useRouter();

  const redirect = (href: string) => {
    progress.start(); // show the indicator

    startTransition(() => {
      push(href);
      progress.done(); // only runs when the destination page is fully loaded
    });
  };

  const handleRedirect = (reload: boolean, depth: number) => {
    if (depth === 0) {
      if (reload) {
        redirect("/tasks");
      } else {
        back();
      }
    } else {
      back();
    }
  };

  const handleExecuteTask = async () => {
    // if ($iam_user(["ExecuteTask"], user)) {
    if (true) {
      if (selectedTask && selectedTaskFunction) {
        const result: tTaskExecutionResult = await executeTask(
          selectedTask.id,
          selectedTaskFunction
        );

        if (result.executed) {
          await getUncompletedTasksCount().then((value: number) =>
            setTaskAvailable(value > 0)
          );

          handleCancelClick();
          handleRedirect(true, depth);
        } else {
          let alert: tAlert = {
            template: "TASK_NOT_EXECUTED",
            params: { message: result.message },
          };

          setAlert(alert);
        }
      }
    }
  };

  const Buttons = (): JSX.Element => {
    return (
      <div className="flex flex-col">
        <Button
          name="Cancel"
          intent={"neutral"}
          style={"soft"}
          size={"small"}
          onClick={handleCancelClick}
          className="bg-cancel"
          type="button"
        />
        {!isTaskCompleted() && (
          <Button
            name="Execute"
            intent={"neutral"}
            style={"soft"}
            size={"small"}
            className="bg-custom"
            onClick={handleExecuteTask}
          />
        )}
      </div>
    );
  };

  const closeDialog = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    setAlert(undefined);
  };

  return (
    <div>
      <div className="relative w-[100%] flex justify-between">
        <div className="w-[85%]">
          <Content />
        </div>
        <div className="w-[13%] flex justify-end">
          <Buttons />
        </div>
      </div>
      <TemplateAlert
        open={alert ? true : false}
        template={alert ? alert.template : ""}
        parameters={alert ? alert.params : {}}
      >
        <div className="flex space-x-1">
          <Button
            name="OK"
            className="bg-orange-500"
            size="small"
            onClick={(e) => {
              closeDialog(e);
            }}
          />
        </div>
      </TemplateAlert>
    </div>
  );
};

export default TaskForm;
