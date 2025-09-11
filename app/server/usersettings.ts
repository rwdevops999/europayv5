"use server";

import { tUserSetting, tUserSettingCreate } from "@/lib/prisma-types";
import prisma from "@/lib/prisma";
import { json } from "@/lib/util";

export const createUserSettings = async (
  _settings: tUserSettingCreate[]
): Promise<void> => {
  for (let i = 0; i < _settings.length; i++) {
    const setting: tUserSettingCreate = _settings[i];
    await prisma.userSetting.create({
      data: setting,
    });
  }
};

export const updateUserSetting = async (
  _id: number,
  _value: string
): Promise<void> => {
  await prisma.userSetting.update({
    where: {
      id: _id,
    },
    data: {
      value: _value,
    },
  });
};
