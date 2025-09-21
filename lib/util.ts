import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  months,
  ToastTypes,
  URL_ENCODING_AMPERSAND,
  URL_ENCODING_ASSIGNMENT,
} from "./constants";
import { Zoom } from "react-toastify";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

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
  _on: boolean,
  _type: string,
  _message: string,
  _durationms: number,
  _position?: string
): void => {
  if (_on) {
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
  }
};

/**
 * convert string value to boolean
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

/**
 * Capitalize a word (which is first converted to lowerCase)
 *
 * @param str the string to capitalize
 *
 * @returns the capitalized word
 */
export const capitalize = (str: string): string => {
  return str.toLowerCase().charAt(0).toUpperCase() + str.toLowerCase().slice(1);
};

/**
 * Convert a value (any object) to JSON string
 *
 * @param _value the object to convert
 *
 * @returns a JSON string
 */
export const json = (_value: any): string => {
  return JSON.stringify(_value);
};

const AzertyMapping: Record<string, string[]> = {
  KeyQ: ["a", "A"],
  Semicolon: ["m", "M"],
  KeyA: ["q", "Q"],
  KeyZ: ["w", "W"],
  KeyW: ["z", "Z"],
};

export const getKeyMapping = (_key: string): string => {
  const index: number = Object.values(AzertyMapping).findIndex(
    (arr: string[]) => arr.includes(_key)
  );

  if (index != -1) {
    return Object.keys(AzertyMapping)[index];
  }

  return `Key${_key.toLocaleUpperCase()}`;
};

export const padZero = (
  num: number,
  length: number,
  prefix: string = ""
): string => `${prefix}` + `${(num + "").padStart(length, "0")}`;

export const convertDatabaseDateToString = (date: Date | null): string => {
  return date ? moment(date).format("DD-MMM-YYYY (HH:mm:ss)") : "";
};

export const generateUUID = (): string => {
  const params: string[] = uuidv4().split("-");

  return params[params.length - 1];
};

export const validEmail = (_email: string) => {
  const re: RegExp = /^\S+@\S+\.\S+$/;
  return re.test(_email);
};

export const generatePAT = (): string => {
  const pat: string = uuidv4().replaceAll("-", "");

  return pat;
};

export const generateClientSecret = (): string => {
  const params: string[] = uuidv4().split("-");

  return "CS" + params[params.length - 1];
};

export const renderDateInfo = (dateValue: string): string => {
  const date = new Date(dateValue);

  return (
    date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
  );
};
