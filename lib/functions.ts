import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ToastTypes,
  URL_ENCODING_AMPERSAND,
  URL_ENCODING_ASSIGNMENT,
} from "./constants";
import { Zoom } from "react-toastify";

/**
 * create an abosulte url
 *
 * @param path the last segment of the URL
 * @param useEnv use env variables
 *
 * @returns the basolute url ("http://localhost:3000/.../path")
 */
export const absoluteUrl = (path: string, useEnv: boolean = true): string => {
  let urlStart: string | undefined = process.env.NEXT_PUBLIC_APP_URL;
  if (!(urlStart && useEnv)) {
    urlStart = "http://localhost:3000";
  }

  return `${urlStart}${path}`;
};

/**
 * merge tailwind classes
 *
 * @param inputs classNames
 *
 * @returns the merged className
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

/**
 * chick if value is a number
 *
 * @param val any value
 *
 * @returns true if val is a number, false otherwise
 */
export const isNumber = (val: any): boolean => {
  return !(val instanceof Array) && val - parseFloat(val) + 1 >= 0;
};

/**
 * create a promise for _value
 *
 * @param _value the values inside the promise
 *
 * @returns a Promise
 */
export const CreatePromise = (_value: any | any[]): Promise<any | any[]> => {
  return new Promise<any>((resolve, reject) => resolve(_value));
};

/**
 * split the URL params and put the results in a Record
 *
 * @param _url the url params to split ("id=5&testid=100 => {id: 5, testid: 100}")
 *
 * @returns a Record where key is the parameter and value is the parametervalue
 */
export const splitURLParams = (_params: string): Record<string, string> => {
  const params: string[] = _params.split(URL_ENCODING_AMPERSAND);

  const collected: Record<string, string> = params.reduce<
    Record<string, string>
  >((accumulator, value: string) => {
    const values: string[] = value.split(URL_ENCODING_ASSIGNMENT);

    accumulator[values[0]] = values[1];

    return accumulator;
  }, {});

  return collected;
};

/**
 * Sleep for some time
 *
 * @param ms the delay in milliseconds
 */
export const SLEEP = async (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * display a toast
 *
 * @param _type the type of toast (info, error, ...)
 * @param _message the message to display
 * @param _durationms the duration in milliseconds
 * @param _position the postion where to place the toast
 */
export const showToast = (
  _type: string,
  _message: string,
  _durationms: number,
  _position?: string
): void => {
  ToastTypes[_type](_message, {
    position: _position ?? "top-center",
    autoClose: _durationms,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "dark",
    transition: Zoom,
  });
};

/**
 * consvert string value to boolean
 *
 * @param _value the string value
 * @param _default returned default value (if _value === undefined)
 *
 * @returns true or false
 */
export const stringToBoolean = (
  _value: string | undefined,
  _default: boolean = false
): boolean => {
  if (_value) {
    return /true/.test(_value.toLocaleLowerCase());
  } else {
    return _default;
  }
};
