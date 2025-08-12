"use server";

import {
  tAccountApply,
  tCountry,
  tUser,
  tUserCreate,
} from "@/lib/prisma-types";
import { tTaskParams } from "./data/taskdata";
import { AccountApplyStatus, Gender } from "@/generated/prisma";
import { createUser, loadUserByNames } from "./users";
import { displayPrismaErrorCode } from "@/lib/prisma-errors";
import {
  getAccountApplicationById,
  updateAccountApplicationStatus,
} from "./apply";
import { loadCountryByName } from "./country";
import prisma from "@/lib/prisma";
import { tEmail } from "./data/email-data";
import { sendEmail } from "./email";

/**
 * this action can b performed manually, but here we lt user execute it.s
 * @param _params
 */
export const handleUserCreation = async (
  _params: tTaskParams
): Promise<void> => {
  const application: tAccountApply | null = await getAccountApplicationById(
    _params["applicationId"]
  );

  if (application) {
    await updateAccountApplicationStatus(
      application.id,
      AccountApplyStatus.OPEN
    );

    const country: tCountry | null = await loadCountryByName(
      application.country
    );

    /* THIS USER WILL NEED A ROLE OF CLIENT */
    const user: tUserCreate = {
      username: application.username,
      firstname: application.firstname,
      lastname: application.lastname,
      email: application.email,
      password: application.password,
      passwordless: false,
      avatar:
        application.gender === Gender.MALE ? "john.doe.png" : "jane.doe.png",
      address: {
        create: {
          street: "",
          number: "",
          box: "",
          city: "",
          postalcode: "",
          county: "",
          country: {
            connect: {
              id: country ? country.id : 0,
            },
          },
        },
      },
    };

    await createUser(user, false).then((errorcode: string | undefined) => {
      if (errorcode) {
        // show a toast here about error
        displayPrismaErrorCode(errorcode);
      }
    });
  }
};

export const handleUserCreationFinish = async (
  _params: tTaskParams
): Promise<void> => {
  const application: tAccountApply | null = await getAccountApplicationById(
    _params["applicationId"]
  );

  if (application) {
    const _email: tEmail = {
      destination: application.email,
      template: "ACCOUNT_CREATED",
      asHTML: true,
      params: { email: application.email, url: "http://localhost:3000/login" },
    };

    await sendEmail(_email).then(async () => {
      await updateAccountApplicationStatus(
        application.id,
        AccountApplyStatus.CLOSED
      );
    });
  }
};

export const handleAccountCreation = async (
  _params: tTaskParams
): Promise<void> => {
  const application: tAccountApply | null = await getAccountApplicationById(
    _params["applicationId"]
  );

  if (application) {
    const user: tUser | null = await loadUserByNames(
      application.firstname,
      application?.lastname
    );

    if (user) {
      await prisma.account.create({
        data: {
          amount: 0,
          userId: user.id,
        },
      });
    }
  }
};
