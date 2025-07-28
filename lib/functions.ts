import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const absoluteUrl = (path: string, useEnv: boolean = true): string => {
  let urlStart: string | undefined = process.env.NEXT_PUBLIC_APP_URL;
  if (!(urlStart && useEnv)) {
    urlStart = "http://localhost:3000";
  }

  return `${urlStart}${path}`;
};

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
