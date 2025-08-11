"use server";

import {
  cWhatToSelectFromPolicy,
  tPolicy,
  tPolicyCreate,
  tPolicyUpdate,
} from "@/lib/prisma-types";
import prisma from "@/lib/prisma";

/**
 * Load all policies from DB
 *
 * @returns an array with the policies (tPolicy[])
 */
export const loadPolicies = async (): Promise<tPolicy[]> => {
  let result: tPolicy[] = [];

  await prisma.policy
    .findMany({
      ...cWhatToSelectFromPolicy,
    })
    .then((values: tPolicy[]) => (result = values));

  return result;
};

/**
 * Create a policy
 *
 * @param _policy the policy creation object
 *
 * @returns a string with an errorcode if an error occured otherwise undefined
 */
export const createPolicy = async (
  _policy: tPolicyCreate
): Promise<string | undefined> => {
  let errorcode: string | undefined = undefined;
  await prisma.policy
    .create({
      data: _policy,
    })
    .catch((error: any) => (errorcode = error.code));

  return errorcode;
};

/**
 * Updates a policy
 *
 * @param _policy the update object
 *
 * @returns error string or undefined (if no error occured)
 */
export const updatePolicy = async (
  _policy: tPolicyUpdate
): Promise<string | undefined> => {
  let errorcode: string | undefined = undefined;
  await prisma.policy
    .update({
      where: {
        id: _policy.id as number,
      },
      data: _policy,
    })
    .catch((error: any) => (errorcode = error.code));

  return errorcode;
};

/**
 * Deletes a policy
 *
 * @param _id the policy id
 */
export const deletePolicy = async (_id: number): Promise<void> => {
  await prisma.policy.delete({
    where: {
      id: _id,
    },
  });
};
