"use server";

import { tUserSettingCreate } from "@/lib/prisma-types";
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
