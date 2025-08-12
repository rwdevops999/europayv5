"use server";

import { tAccountApply } from "@/lib/prisma-types";
import { ApplyData } from "./data/apply-data";
import prisma from "@/lib/prisma";
import { encrypt } from "./encrypt";
import { DEFAULT_COUNTRY } from "@/lib/constants";

export const applyForUserAccount = async (
  _data: ApplyData
): Promise<tAccountApply | undefined> => {
  let result: tAccountApply | undefined = undefined;

  await prisma.accountApply
    .create({
      data: {
        username: _data.username,
        firstname: _data.firstname,
        lastname: _data.lastname,
        email: _data.email,
        password: await encrypt(_data.password),
        country: _data.country ?? DEFAULT_COUNTRY,
        gender: _data.gender,
      },
    })
    .then((value: tAccountApply) => (result = value));

  return result;
};
