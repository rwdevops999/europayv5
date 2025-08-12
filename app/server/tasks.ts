"use server";

import { cWhatToSelectFromTask, tTask, tTemplate } from "@/lib/prisma-types";
import {
  tTaskExecutionResult,
  tTaskFunction,
  tTaskSetup,
} from "./data/taskdata";
import { fillTemplate, loadTemplateByName } from "./templates";
import prisma from "@/lib/prisma";
import { Prisma, TaskStatus } from "@/generated/prisma";
import { absoluteUrl, padZero } from "@/lib/util";
import { revalidatePath } from "next/cache";

/**
 * load all the tasks
 *
 * @returns an array of tTask (prisma model)
 */
export const loadTasks = async (): Promise<tTask[]> => {
  let result: tTask[] = [];

  await prisma.task
    .findMany({
      orderBy: {
        id: "asc",
      },
      ...cWhatToSelectFromTask,
    })
    .then((values: tTask[]) => (result = values));

  return result;
};

/**
 * create a task
 *
 * @param _taskSetup: task setup information (see in taskdata)
 * @param _linkedTaskId: the taskId of the linked task
 *
 * @returns the taskId of the created task or undefined (if template not foun or when task creation failedd)
 */
export const createTask = async (
  _taskSetup: tTaskSetup,
  _linkedTaskId?: number | undefined
): Promise<number | undefined> => {
  let taskId: number | undefined = undefined;

  await loadTemplateByName(_taskSetup.template).then(
    async (template: tTemplate | undefined) => {
      if (template) {
        const _description: string | undefined = await fillTemplate(
          template.content,
          _taskSetup.templateParams
        );

        await prisma.task
          .create({
            data: {
              name: _taskSetup.name,
              description: _description ?? "",
              fromStatus: _taskSetup.fromStatus,
              params: _taskSetup.taskParams,
              predecessorTaskId: _linkedTaskId,
            },
            ...cWhatToSelectFromTask,
          })
          .then((value: tTask) => {
            taskId = value.id;
          });
      }
    }
  );

  return taskId;
};

/**
 * Get all tasks which are not completed
 *
 * @returns : the number of tasks (with status CREATED or OPEN)
 */
export const getUncompletedTasksCount = async (): Promise<number> => {
  let result: number = 0;
  await prisma.task
    .count({
      where: {
        OR: [
          {
            status: TaskStatus.CREATED,
          },
          {
            status: TaskStatus.OPEN,
          },
        ],
      },
    })
    .then((value: number) => (result = value));

  return result;
};

export const loadTaskById = async (_id: number): Promise<tTask | null> => {
  let result: tTask | null = null;

  await prisma.task
    .findFirst({
      where: {
        id: _id,
      },
      ...cWhatToSelectFromTask,
    })
    .then((value: tTask | null) => (result = value));

  return result;
};

/**
 * Set the task status
 *
 * @param _id the task id
 * @param _status the new task status
 */
export const setTaskStatus = async (
  _id: number,
  _status: TaskStatus
): Promise<void> => {
  await prisma.task.update({
    where: {
      id: _id,
    },
    data: {
      status: _status,
    },
    ...cWhatToSelectFromTask,
  });
};

/**
 * executes the task with given id
 *
 * @param _taskId
 *
 * @returns : execution result containing eventually error (in message) whet-n result.executed = false;
 */
export const executeTask = async (
  _taskId: number,
  _func: tTaskFunction
): Promise<tTaskExecutionResult> => {
  const result: tTaskExecutionResult = {
    executed: false,
    message: "",
  };

  let execute: boolean = false;
  let message: string = "";

  // Get task from DB
  await prisma.task
    .findFirst({
      where: {
        id: _taskId,
      },
      ...cWhatToSelectFromTask,
    })
    .then(async (task: tTask | null) => {
      if (task) {
        if (task.fromStatus.includes(task.status)) {
          // const func: tTaskFunction | undefined = taskFunctions[task.name].find(
          //   (_tf: tTaskFunction) => _tf.onStatus === task.status
          // );

          if (task.successorTask) {
            if (_func) {
              if (_func.linkedStatus.includes(task.successorTask.status)) {
                execute = true;
              } else {
                message = `Error: successor task ${padZero(
                  task.successorTask.id,
                  5,
                  "TSK"
                )} is in status ${
                  task.successorTask.status
                }. Must be in status ${_func.linkedStatus}`;
              }
            }
          }

          if (task.predecessorTask) {
            if (_func) {
              if (_func.linkedStatus.includes(task.predecessorTask.status)) {
                execute = true;
              } else {
                message = `Error: predecessor task ${padZero(
                  task.predecessorTask.id,
                  5,
                  "TSK"
                )} is in status ${
                  task.predecessorTask.status
                }. Must be in status ${_func.linkedStatus}`;
              }
            }
          }

          if (execute) {
            execute = false;
            _func.action(task.params as Prisma.JsonArray);
            result.executed = true;
            await setTaskStatus(task.id, _func.toStatus).then(() => {
              message = `task ${task.id} executed`;
              revalidatePath(absoluteUrl("/tasks"));
            });
          }
        } else {
          message = `Error: task ${padZero(task.id, 5, "TSK")} is in status ${
            task.status
          }. Must be in status ${task.fromStatus}`;
        }
      }
    });

  if (!result.executed) {
    result.message = message;
  }

  return result;
};
