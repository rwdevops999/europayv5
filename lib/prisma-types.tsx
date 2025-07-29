import { Prisma } from "@/generated/prisma";

/* =========== SERVICE ACTION =========== */
type WhatToSelectFromServiceAction = {
  select: {
    id: boolean;
    serviceactionname: boolean;
    services: boolean;
    // serviceStatementActions: boolean;
  };
};
const cWhatToSelectFromServiceAction: WhatToSelectFromServiceAction = {
  select: {
    id: true,
    serviceactionname: true,
    services: false,
    // serviceStatementActions: false,
  },
};

export type tServiceAction =
  Prisma.ServiceActionGetPayload<WhatToSelectFromServiceAction>;

/* =========== SERVICE =========== */
type WhatToSelectFromService = {
  select: {
    id: boolean;
    servicename: boolean;
    serviceactions: WhatToSelectFromServiceAction;
    // servicestatements: boolean;
  };
};
export const cWhatToSelectFromService: WhatToSelectFromService = {
  select: {
    id: true,
    servicename: true,
    serviceactions: cWhatToSelectFromServiceAction,
    // servicestatements: false,
  },
};

export type tService = Prisma.ServiceGetPayload<WhatToSelectFromService>;
