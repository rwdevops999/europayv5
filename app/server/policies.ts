"use server";

import {
  cWhatToSelectFromPolicy,
  tPolicy,
  tPolicyCreate,
  tPolicyUpdate,
  tServiceStatement,
} from "@/lib/prisma-types";
import prisma from "@/lib/prisma";
import { ManagedPolicies } from "./setup/managed-iam";
import { getServiceStatementIdByName } from "./service-statements";

/**
 * Load all policies from DB
 *
 * @returns an array with the policies (tPolicy[])
 */
export const loadPolicies = async (): Promise<tPolicy[]> => {
  let result: tPolicy[] = [];

  await prisma.policy
    .findMany({
      orderBy: {
        createDate: "desc",
      },
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

export const defineManagedPolicies = async (): Promise<void> => {
  // TRUNCATE Policy

  const policyNames: string[] = Object.keys(ManagedPolicies);

  for (let policyName of policyNames) {
    const policyInfo: any = ManagedPolicies[policyName];

    const statements: string[] = policyInfo.statement;

    const statementids: any[] = [];
    for (let statementName of statements) {
      statementids.push({
        id: await getServiceStatementIdByName(statementName),
      });

      const create: tPolicyCreate = {
        name: policyName,
        description: policyInfo.description,
        managed: true,
        servicestatements: {
          connect: statementids,
        },
      };

      await createPolicy(create);
    }
  }
};

export const getPolicyIdByName = async (_name: string): Promise<number> => {
  let result: number = -1;

  await prisma.policy
    .findFirst({
      where: {
        name: _name,
      },
      select: {
        id: true,
      },
    })
    .then((value: any | null) => {
      if (value) {
        result = value.id;
      }
    });

  if (result === -1) {
    console.log("ERROR: YOU LOOKED UP AN UNKNOWN POLICY", _name);
  }

  return result;
};
