# handling tasks

Tasks tell who what to do.

## single tasks

Single task are task which stand alone. They do not depend on other tasks.

- [ ) add task to 'templates.json'

```typescript
const testTask: tTaskSetup = {
  name: "TEST_TASK", // taskname: Hereby we can identify the task
  template: "TEST_TASK_EXECUTION", // template: template name by which we fill in the description of the task
  templateParams: { name: "MyName" }, // templateParams: parameters for template content replacement
  taskParams: { subjectId: 12345 }, // parameters for the task such as in this case the application id
  // (which contains e.g. the requestors email)
  fromStatus: [TaskStatus.CREATED, TaskStatus.OPEN], // if the task status is in fromStatus, the function may execute
  // The function to be executed can be found is taskFunctions
};
```

- [ ] add template to templates.json
      {
      "role": "TASK",
      "name": "TEST_TASK_EXECUTION",
      "description": "Task execution",
      "content": "Test Task for ${name}",
      "managed": true,
      "parameters": "{name: #variable}"
      }

- [ ] add the function(s) (in constants.ts, variable taskFunctions: Record<string, tTaskFunction[]>

```typescript (taskdata.ts)
export const taskFunctions: Record<string, tTaskFunction[]> = {
  TEST_TASK: [
    { // This is the function that can execute when task is in status CREATED
      id: 4,
      onStatus: TaskStatus.CREATED,
      toStatus: TaskStatus.OPEN,
      linkedStatus: [],
      action: taskTest1,
    },
    {// This is the function that can execute when task is in status OPEN
      id: 5,
      onStatus: TaskStatus.OPEN,
      toStatus: TaskStatus.COMPLETE,
      linkedStatus: [],
      action: taskTest2,
    },
  ],
```

## linked tasks

This describes linked tasks. Task who's functionalities depend on each other.

Suppose someone is applying for an account.
So we need to check to application (and create an user for this person), but there needs also an account being created before application can finish.

- [ ] We create the task 'the application for an account'

We setup the task

    const testTask: tTaskSetup = {
      name: TASK_APPLICATION,											// taskname: Hereby we can identify the task
      template: "HANDLE_USER_APPLICATION",								// template: template name by which we fill in the description of the task
      templateParams: { email: _application.email },					// templateParams: parameters for template content replacement
      taskParams: { subjectId: _application.id },						// parameters for the task such as in this case the application id (which contains e.g. the 																			 requestors email)
      fromStatus: [TASK_STATUS_CREATED, TASK_STATUS_OPEN],				// if the task status is in fromStatus, the function may execute
    };

- [ ] We create the task and rememeber it's ID

  const taskId = await createTask(testTask);

- [ ] Now we create the linked task (creating an account)

We setup the task

    const testTask2: tTaskSetup = {
      name: TASK_APPLICATION_CREATE,
      template: "HANDLE_USER_ACCOUNT_CREATE",
      templateParams: { email: _application.email },
      taskParams: { subjectId: _application.id },						// is a Record<string,any>
      fromStatus: [TASK_STATUS_CREATED],								// The function can execute when task is in any of these statussess (array)
    };

example of taskParams: (is a Record<string, any>)

    taskParams: Record<string, any> = {
      value1: {
        id: 100,
      },
      value2: 200,
      value3: {
        xxx: "test",
      },
    };

- [ ] We create the linked task and link the previous created task (in Step2) to this task

  await createTask(testTask2, taskId);

### CreateTask: What it does ?

First, the template is loaded. Which, togeteher with the parametes give the description of the task.
For task we set next parameters (from tTaskSetup)

name: name,
description: description coming from template and templateParams,
fromStatus: \_taskSetup.fromStatus,
subjectId: \_taskSetup.taskParams.subjectId,
status: TASK_STATUS_CREATED,
predecessorTaskId: \_linkedTaskId,

- [ ] TaskFunctions definitions

In taskdata.ts, we define an array taskFunctions which describes what need to happen by execution if the task

```typescript
export const taskFunctions: Record<string, tTaskFunction[]> = {
  TASK_APPLICATION: [
    {
      id: 1,
      onStatus: TaskStatus.CREATED,
      toStatus: TaskStatus.OPEN,
      linkedStatus: [TaskStatus.CREATED],
      action: taskApplicationOpen,
    },
    {
      id: 2,
      onStatus: TaskStatus.OPEN,
      toStatus: TaskStatus.COMPLETE,
      linkedStatus: [TaskStatus.COMPLETE],
      action: taskApplicationComplete,
    },
  ],
  TASK_APPLICATION_CREATE: [
    {
      id: 3,
      onStatus: TaskStatus.CREATED,
      toStatus: TaskStatus.COMPLETE,
      linkedStatus: [TaskStatus.OPEN],
      action: taskApplicationCreate,
    },
  ],
};
```

So pipeline runs like this:

Task1 is in status CREATED
From fromStatus, we can see that this task can execute actions when in status CREATED or OPEN.
For this, we notice in taskFunctions 2 actions for this task (id 1 and 2).
The first action (id 1) runs when task is in status CREATED and as an result the status becomes OPEN.
However, this task can only run when the linked task is in status CREATED.

When Task1 gets to status OPEN, we can notice that there is another action (id 2),
which can run when task1 is in status OPEN (resulting task1 status COMPLETE) and the linked task is
in status COMPLETE.
