"use server";

import { tHistory, tTemplate } from "@/lib/prisma-types";
import prisma from "@/lib/prisma";
import { HistoryType } from "@/generated/prisma";
import { fillTemplate, loadTemplateByName } from "./templates";

export const loadHistory = async (): Promise<tHistory[]> => {
  let result: tHistory[] = [];

  await prisma.history
    .findMany()
    .then((values: tHistory[]) => (result = values));

  return result;
};

export const createHistoryEntry = async (
  _type: HistoryType,
  _allowedTypes: HistoryType[],
  _template: string,
  _params: Record<string, string>,
  _originator: string
): Promise<void> => {
  if (_allowedTypes.includes(_type)) {
    await loadTemplateByName(_template).then(
      async (value: tTemplate | undefined) => {
        if (value) {
          await prisma.history.create({
            data: {
              type: _type,
              title: value.description,
              description: await fillTemplate(value.content, _params),
              originator: _originator,
            },
          });
        }
      }
    );
  }
};
