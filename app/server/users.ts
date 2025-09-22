"use server";

import prisma from "@/lib/prisma";
import {
  cWhatToSelectFromUser,
  tUser,
  tUserCreate,
  tUserPat,
  tUserUpdate,
} from "@/lib/prisma-types";
import { decrypt, encrypt } from "./encrypt";
import { AccountStatus, UserType } from "@/generated/prisma";
import { json } from "@/lib/util";
import { SystemUsers } from "./setup/managed-iam";

export const loadUserById = async (_userId: number): Promise<tUser | null> => {
  let result: tUser | null = null;

  console.log("LOAD USER BY ID", _userId);
  await prisma.user
    .findFirst({
      where: {
        id: _userId,
      },
      ...cWhatToSelectFromUser,
    })
    .then(async (value: tUser | null) => {
      if (value) {
        console.log("LOADED", json(value));
        if (!value.passwordless) {
          value.password = await decrypt(value.password);
        }
        for (let i = 0; i < value.pats.length; i++) {
          value.pats[i].tokenName = await decrypt(value.pats[i].tokenName);
          value.pats[i].token = await decrypt(value.pats[i].token);
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
    .then((value: tUser) => {
      console.log("[createUser] : RESULT", value.id);
      result = value;
    })
    .catch((error: any) => {
      console.log("[createUser] : error", json(error));
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
      console.dir("UPDATE ERROR: " + json(error), { depth: null });
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

export const createUserAsGuestUsingUsername = async (
  _username: string
): Promise<tUser | null> => {
  let result: tUser | null = null;

  await prisma.user
    .create({
      data: {
        email: "",
        passwordless: true,
        attemps: 0,
        blocked: false,
        type: UserType.GUEST,
        username: _username,
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

  console.log("LOAD USER BY EUN", _value);
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
    .then(async (value: tUser | null) => {
      if (value) {
        console.log("LOADED USER BY EUN", json(value));
        if (!value.passwordless) {
          value.password = await decrypt(value.password);
        }

        for (let i = 0; i < value.pats.length; i++) {
          value.pats[i].tokenName = await decrypt(value.pats[i].tokenName);
          value.pats[i].token = await decrypt(value.pats[i].token);
        }
      }
      result = value;
    });

  console.log("[RESULT]", json(result));

  return result;
};

export const defineSystemUsers = async (): Promise<void> => {
  // TRUNCATE User => Address, Account, Transaction

  const userNames: string[] = Object.keys(SystemUsers);

  for (let userName of userNames) {
    console.log("CREATE USER", userName);
    const userInfo: any = SystemUsers[userName];

    let accountcreation: any = {};
    if (userInfo.addAccount) {
      accountcreation = {
        create: {
          amount: userInfo.accountAmount ?? 0,
          status: AccountStatus.OPEN,
        },
      };
    }

    const create: tUserCreate = {
      username: userName,
      lastname: userInfo.lastname,
      firstname: userInfo.firstname,
      email: userInfo.email,
      password: userInfo.password ?? "",
      passwordless: userInfo.passwordless,
      avatar: userInfo.avatar ?? "john.doe.png",
      managed: true,
      system: true,
      type: UserType[
        userInfo.type.toLocaleUpperCase() as keyof typeof UserType
      ],
      address: {
        create: {
          country: {
            connect: {
              name: userInfo.country,
            },
          },
        },
      },
      account: accountcreation,
    };

    console.log("CREATE INFO", json(create));

    await createUser(create)
      .then(() => console.log("USER CREATED", userName))
      .catch((reason: any) => console.log("USER NOT CREATED", json(reason)));
  }
};

export const getUserIdByNames = async (_names: {
  lastname: string;
  firstname: string;
}): Promise<number> => {
  let result: number = -1;

  await prisma.user
    .findFirst({
      where: {
        AND: [
          {
            lastname: _names.lastname,
          },
          {
            firstname: _names.firstname,
          },
        ],
      },
      select: {
        id: true,
      },
    })
    .then((value: any) => (result = value.id));

  if (result === -1) {
    console.log("ERROR: YOU LOOKED UP AN UNKNOWN USER", json(_names));
  }

  return result;
};
