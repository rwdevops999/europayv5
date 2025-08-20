"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { FaTasks } from "react-icons/fa";

interface TaskContextInterface {
  getTaskNode: () => ReactNode;
  setTaskAvailable: (value: boolean) => void;
}

const TaskContext = createContext<TaskContextInterface | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [taskAvailable, setTaskAvailable] = useState<boolean>(false);

  const getTaskNode = (): ReactNode => {
    return (
      <>
        {taskAvailable && (
          <div className="flex items-center justify-center border border-foreground/30">
            <div
              data-testid="tasks"
              className="tooltip tooltip-bottom"
              data-tip={`Tasks: available`}
            >
              <FaTasks className="text-red-500" size={12} />
            </div>
          </div>
        )}
        {!taskAvailable && (
          <div className="flex items-center justify-center border border-foreground/30">
            <div
              data-testid="tasks"
              className="tooltip tooltip-bottom"
              data-tip={`Tasks: none`}
            >
              <FaTasks className="text-green-500" size={12} />
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <TaskContext.Provider value={{ getTaskNode, setTaskAvailable }}>
      {children}
    </TaskContext.Provider>
  );
};

export default {
  TaskProvider,
  useTask,
};
