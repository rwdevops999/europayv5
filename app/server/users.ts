"use server";

import prisma from "@/lib/prisma";
import {
  cWhatToSelectFromUser,
  tUser,
  tUserCreate,
  tUserUpdate,
} from "@/lib/prisma-types";
import { decrypt, encrypt } from "./encrypt";
import { UserType } from "@/generated/prisma";

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
      orderBy: {
        createDate: "desc",
      },
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
): Promise<string | undefined | tUser> => {
  let result: string | undefined | tUser = undefined;

  _user.password =
    _user.passwordless || !_encrypt
      ? _user.password
      : await encrypt(_user.password);

  await prisma.user
    .create({
      data: _user,
      ...cWhatToSelectFromUser,
    })
    .then((value: tUser) => (result = value))
    .catch((error: any) => {
      result = error.code;
    });

  return result;
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

export const loadUserByEmail = async (
  _email: string
): Promise<tUser | null> => {
  let result: tUser | null = null;

  await prisma.user
    .findFirst({
      where: {
        email: _email,
      },
      ...cWhatToSelectFromUser,
    })
    .then(async (value: tUser | null) => {
      if (value) {
        if (value.password && value.password.length > 0) {
          value.password = await decrypt(value.password);
        }
        result = value;
      }
    });

  return result;
};

export const createUserAsGuest = async (
  _email: string
): Promise<tUser | null> => {
  let result: tUser | null = null;

  await prisma.user
    .create({
      data: {
        email: _email,
        passwordless: true,
        attemps: 0,
        blocked: false,
        type: UserType.GUEST,
        username: "",
        lastname: "",
        firstname: "",
        avatar: "",
        phone: "",
        password: "",
      },
      ...cWhatToSelectFromUser,
    })
    .then((value: tUser) => {
      result = value;
    });

  return result;
};

export const updateUserAttemps = async (
  _id: number,
  _attemps: number
): Promise<void> => {
  await prisma.user.update({
    where: {
      id: _id,
    },
    data: {
      attemps: _attemps,
    },
  });
};

export const blockUser = async (_id: number): Promise<void> => {
  await prisma.user.update({
    where: {
      id: _id,
    },
    data: {
      blocked: true,
    },
  });
};

export const loadUserByUsernameOrEmail = async (
  _value: string
): Promise<tUser | null> => {
  let result: tUser | null = null;

  await prisma.user
    .findFirst({
      where: {
        OR: [
          {
            username: _value,
          },
          {
            email: _value,
          },
        ],
      },
      ...cWhatToSelectFromUser,
    })
    .then((value: tUser | null) => (result = value));

  return result;
};
