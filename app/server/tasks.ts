"use server";

import { cWhatToSelectFromTask, tTask, tTemplate } from "@/lib/prisma-types";
import { tTaskSetup } from "./data/taskdata";
import { fillTemplate, loadTemplateByName } from "./templates";
import prisma from "@/lib/prisma";

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
