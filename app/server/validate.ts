"use server";

import { Data } from "@/lib/types";
import { ActionRoute, ValidationConflict } from "./data/validation-data";
import { Permission } from "@/generated/prisma";

let allowedActions: ActionRoute[] = [];
let deniedActions: ActionRoute[] = [];

const prettify = (path: any[]): string => {
  return path.join(" > ");
};

const validateChildren = (data: Data[], path: string[]): void => {
  data.forEach((d: Data) => {
    let childpath: string[] = [...path];
    if (d.children?.length === 0) {
      let item: ActionRoute = {
        action: d.extra?.action,
        service: d.extra?.servicename ?? "UNKNOWN SERVICE",
        path: path,
      };
      if (d.extra?.access! === Permission.ALLOW) {
        allowedActions.push(item);
      } else {
        deniedActions.push(item);
      }
    } else {
      let pathSection: string = ` [${d.extra?.subject}] ${d.name}`;
      childpath = [...childpath, pathSection];
      validateChildren(d.children!, childpath);
    }
  });
};

const intersection = (
  allowed: ActionRoute[],
  denied: ActionRoute[]
): ValidationConflict[] => {
  const conflicts: ValidationConflict[] = [];
  let count: number = 1;

  allowed.forEach((item1: ActionRoute) => {
    let found: boolean = false;
    for (let j = 0; j < denied.length && !found; j++) {
      let item2 = denied[j],
        found = item1.action === item2.action;
      if (found) {
        conflicts.push({
          id: count++,
          action: item1.action,
          service: item1.service,
          allowedPath: prettify(item1.path),
          deniedPath: prettify(item2.path),
        });
      }
    }
  });

  return conflicts;
};

export const validateData = async (
  data: Data
): Promise<ValidationConflict[]> => {
  allowedActions = [];
  deniedActions = [];

  let pathSection: string = `[${data.extra?.subject}] ${data.name} `;

  validateChildren(data.children!, [pathSection]);

  return intersection(allowedActions, deniedActions);
};
