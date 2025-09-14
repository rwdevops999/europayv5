"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface InitContextInterface {
  init: boolean;
  setInit: (_b: boolean) => void;
}

const InitContext = createContext<InitContextInterface | undefined>(undefined);

export const useInit = () => {
  const context = useContext(InitContext);
  if (context === undefined) {
    throw new Error("useInit must be used within a InitProvider");
  }
  return context;
};

export const InitProvider = ({ children }: { children: ReactNode }) => {
  const [init, setInit] = useState<boolean>(false);

  return (
    <InitContext.Provider
      value={{
        init,
        setInit,
      }}
    >
      {children}
    </InitContext.Provider>
  );
};

export default {
  InitProvider,
  useInit,
};
