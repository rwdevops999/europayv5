"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { json } from "../lib/util";
import { timings, tTimingGroup } from "@/app/client/data/timings-data";

interface ThemeContextInterface {
  theme: string;
  setTheme: (value: string) => void;
}

const ThemeContext = createContext<ThemeContextInterface | undefined>(
  undefined
);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>("dark");

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default {
  ThemeProvider,
  useTheme,
};
