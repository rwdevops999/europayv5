import { TaskStatus } from "@/generated/prisma";
import { z } from "zod";
import {
  handleAccountCreation,
  handleUserCreation,
  handleUserCreationFinish,
} from "../taskactions";

// Parameters used by the task execution. These parameters are passed to the task executable function.
export type tTaskParams = Record<string, any>;

// Structure to setup the task for creation
export type tTaskSetup = {
  name: string; // Task name
  template: string; // template used for task
  templateParams: Record<string, string>; // parameters for template content
  taskParams: tTaskParams; // task parameters (e.g. userId for looking up user in User table)
  // taskParams: number; // task parameters (e.g. userId for looking up user in User table)
  fromStatus: TaskStatus[]; // statusses from whcih the action is allowed to execute
};

// The result returned from the internal executeTask. Can be received by the client to show the error message
export type tTaskExecutionResult = {
  executed: boolean;
  message: string;
};
export const cTaskDefaultExecutionResult: tTaskExecutionResult = {
  executed: false,
  message: "",
};

// The prototype of the task executable function (used below)
export type tTaskMethod = (param: tTaskParams) => Promise<void>;
// export type tTaskMethod = (param: number) => Promise<void>;

// Description of a taskfunction (used below)
export type tTaskFunction = {
  id: number;
  onStatus: TaskStatus;
  toStatus: TaskStatus;
  linkedStatus: TaskStatus[];
  action: tTaskMethod;
};

// The executable functions for each task
// Record<string, tTaskFunction[]> where
// @param string: is the task name
// @param tTaskFunction[]: an array of functions to be executed depending on statusses
export const taskFunctions: Record<string, tTaskFunction[]> = {
  TASK_CREATE_USER: [
    {
      id: 6,
      onStatus: TaskStatus.CREATED,
      toStatus: TaskStatus.OPEN,
      linkedStatus: [TaskStatus.CREATED],
      action: handleUserCreation,
    },
    {
      id: 7,
      onStatus: TaskStatus.OPEN,
      toStatus: TaskStatus.COMPLETE,
      linkedStatus: [TaskStatus.COMPLETE],
      action: handleUserCreationFinish,
    },
  ],
  TASK_CREATE_ACCOUNT: [
    {
      id: 8,
      onStatus: TaskStatus.CREATED,
      toStatus: TaskStatus.COMPLETE,
      linkedStatus: [TaskStatus.OPEN],
      action: handleAccountCreation,
    },
  ],
};

// For mapping tTask to table data
const taskDataScheme = z.object({
  id: z.number(),
  taskId: z.string(),
  name: z.string(),
  description: z.string(),
  status: z.string(),
  icons: z.array(z.string()),
  children: z.array(z.any()).optional(),
});

export type tTaskData = z.infer<typeof taskDataScheme>;
