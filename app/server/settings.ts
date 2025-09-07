"use server";

import prisma from "@/lib/prisma";
import { tSetting, tSettingCreate } from "@/lib/prisma-types";
import { cleanDbTables } from "./app-tables";

/**
 * count the number of settings entries
 *
 * @returns the number of items in the database
 */
export const countSettings = async (): Promise<number> => {
  let result: number = 0;

  await prisma.setting.count().then((value: number) => (result = value));

  return result;
};

/**
 * create settings
 *
 * @param _settings the settings (tSettingCreate[])
 *
 * @returns true if created, false if not
 */
export const createSettings = async (
  _settings: tSettingCreate[],
  _resetTable: boolean = true,
  _cascadedelete: boolean = true
): Promise<boolean> => {
  let created: boolean = false;

  if (_resetTable) {
    await cleanDbTables(["settings"]);
  } else {
    await prisma.setting.deleteMany({});
  }

  await prisma.setting
    .createMany({
      data: _settings,
    })
    .then(() => {
      created = true;
    });

  return created;
};

/**
 * load the settings
 *
 * @param _types an array of types
 * @param _subtypes an array of subtypes
 * @param _keys an array of keys
 *
 * @returns the settings (tSetting[])
 */
export const loadSettings = async (
  _types: string[],
  _subtypes: string[],
  _keys: string[]
): Promise<tSetting[]> => {
  let settings: tSetting[] = [];
  await prisma.setting
    .findMany({
      where: {
        type:
          _types.length === 0
            ? {
                notIn: _types,
              }
            : {
                in: _types,
              },
        AND: {
          subtype:
            _subtypes.length === 0
              ? {
                  notIn: _subtypes,
                }
              : {
                  in: _subtypes,
                },
          AND: {
            key:
              _keys.length === 0
                ? {
                    notIn: _keys,
                  }
                : {
                    in: _keys,
                  },
          },
        },
      },
    })
    .then((values: tSetting[]) => (settings = values));

  return settings;
};

export const updateSetting = async (_setting: tSetting): Promise<void> => {
  await prisma.setting.updateMany({
    where: {
      type: _setting.type,
      subtype: _setting.subtype,
      key: _setting.key,
    },
    data: {
      value: _setting.value,
    },
  });
};
