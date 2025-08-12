"use server";

import prisma from "@/lib/prisma";
import {
  cWhatToSelectFromUser,
  tUser,
  tUserCreate,
  tUserUpdate,
} from "@/lib/prisma-types";
import { decrypt, encrypt } from "./encrypt";

export const loadUserById = async (_userId: number): Promise<tUser | null> => {
  let result: tUser | null = null;

  await prisma.user
    .findFirst({
      where: {
        id: _userId,
      },
      ...cWhatToSelectFromUser,
    })
    .then(async (value: tUser | null) => {
      if (value) {
        if (!value.passwordless) {
          value.password = await decrypt(value.password);
        }
        result = value;
      }
    });

  return result;
};

export const loadUsers = async (): Promise<tUser[]> => {
  let result: tUser[] = [];

  await prisma.user
    .findMany({
      ...cWhatToSelectFromUser,
    })
    .then(async (values: tUser[]) => {
      for (let i = 0; i < values.length; i++) {
        if (!values[i].passwordless) {
          values[i].password = await decrypt(values[i].password);
        }
      }
      result = values;
    });

  return result;
};

export const deleteUser = async (_id: number): Promise<void> => {
  await prisma.user.delete({
    where: {
      id: _id,
    },
  });
};

export const createUser = async (
  _user: tUserCreate,
  _encrypt: boolean = true
): Promise<string | undefined> => {
  let errorcode: string | undefined = undefined;

  _user.password =
    _user.passwordless || !_encrypt
      ? _user.password
      : await encrypt(_user.password);

  await prisma.user
    .create({
      data: _user,
    })
    .catch((error: any) => {
      errorcode = error.code;
    });

  return errorcode;
};

export const updateUser = async (
  _user: tUserUpdate
): Promise<string | undefined> => {
  let errorcode: string | undefined = undefined;
  _user.password = _user.passwordless
    ? _user.password
    : await encrypt(_user.password as string);

  await prisma.user
    .update({
      where: {
        id: _user.id as number,
      },
      data: _user,
    })
    .catch((error: any) => {
      errorcode = error.code;
    });

  return errorcode;
};

export const loadUserByNames = async (
  _firstname: string,
  _lastname: string
): Promise<tUser | null> => {
  let result: tUser | null = null;

  await prisma.user
    .findFirst({
      where: {
        AND: {
          firstname: _firstname,
          lastname: _lastname,
        },
      },
      ...cWhatToSelectFromUser,
    })
    .then(async (value: tUser | null) => {
      if (value) {
        result = value;
      }
    });

  return result;
};
