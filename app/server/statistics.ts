"use server";

import { Statistics } from "./data/statistic-data";
import prisma from "@/lib/prisma";

export const loadStatistics = async (): Promise<Statistics> => {
  const statistics: Statistics = {
    actions: await prisma.serviceAction.count(),
    services: await prisma.service.count(),
    statements: await prisma.serviceStatement.count(),
    statementactions: await prisma.serviceStatementAction.count(),
    policies: await prisma.policy.count(),
    roles: await prisma.role.count(),
    users: await prisma.user.count(),
    groups: await prisma.group.count(),
    countries: await prisma.country.count(),
  };

  return statistics;
};
