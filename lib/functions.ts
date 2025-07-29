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

export const isNumber = (val: any): boolean => {
  return !(val instanceof Array) && val - parseFloat(val) + 1 >= 0;
};

export const CreatePromise = (_value: any | any[]): Promise<any | any[]> => {
  return new Promise<any>((resolve, reject) => resolve(_value));
};
