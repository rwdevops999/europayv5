import { Prisma } from "@/generated/prisma";

/* == SERVICE ACTION ========== */
type WhatToSelectFromServiceAction = {
  select: {
    id: boolean;
    serviceactionname: boolean;
    services: boolean;
    serviceStatementActions: boolean;
  };
};
const cWhatToSelectFromServiceAction: WhatToSelectFromServiceAction = {
  select: {
    id: true,
    serviceactionname: true,
    services: false,
    serviceStatementActions: false,
  },
};

export type tServiceAction =
  Prisma.ServiceActionGetPayload<WhatToSelectFromServiceAction>;

/* == SERVICE ========== */
type WhatToSelectFromService = {
  select: {
    id: boolean;
    servicename: boolean;
    serviceactions: WhatToSelectFromServiceAction;
    servicestatements: boolean;
  };
};
export const cWhatToSelectFromService: WhatToSelectFromService = {
  select: {
    id: true,
    servicename: true,
    serviceactions: cWhatToSelectFromServiceAction,
    servicestatements: false,
  },
};

export type tService = Prisma.ServiceGetPayload<WhatToSelectFromService>;

/* == ServiceStatementAction ========== */
type WhatToSelectFromServiceStatementAction = {
  select: {
    id: boolean;
    ssactionname: boolean;
    serviceaction: WhatToSelectFromServiceAction;
    servicestatement: boolean;
  };
};
const cWhatToSelectFromServiceStatementAction: WhatToSelectFromServiceStatementAction =
  {
    select: {
      id: true,
      ssactionname: true,
      serviceaction: cWhatToSelectFromServiceAction,
      servicestatement: false,
    },
  };

export type tServiceStatementAction =
  Prisma.ServiceStatementActionGetPayload<WhatToSelectFromServiceStatementAction>;

/* == ServiceStatement ========== */
type SelectNameAndIdOnly = {
  select: {
    id: boolean;
    name: boolean;
  };
};
const cSelectNameAndIdOnly: SelectNameAndIdOnly = {
  select: {
    id: true,
    name: true,
  },
};

type WhatToSelectFromServiceStatement = {
  include: {
    policies: SelectNameAndIdOnly;
    service: WhatToSelectFromService;
    servicestatementactions: WhatToSelectFromServiceStatementAction;
  };
};

export const cWhatToSelectFromServiceStatement: WhatToSelectFromServiceStatement =
  {
    include: {
      policies: cSelectNameAndIdOnly,
      service: cWhatToSelectFromService,
      servicestatementactions: cWhatToSelectFromServiceStatementAction,
    },
  };

export type tServiceStatement =
  Prisma.ServiceStatementGetPayload<WhatToSelectFromServiceStatement>;
export type tServiceStatementCreate =
  Prisma.ServiceStatementUncheckedCreateInput;
export type tServiceStatementUpdate =
  Prisma.ServiceStatementUncheckedUpdateInput;

/* == TEMPLATE ========== */
export type tTemplate = Prisma.TemplateGetPayload<{}>;

/* == POLICY ========== */
type SelectUserScalarOnly = {
  select: {
    id: boolean;
    firstname: boolean;
    lastname: boolean;
  };
};
const cSelectUserScalarOnly: SelectUserScalarOnly = {
  select: {
    id: true,
    firstname: true,
    lastname: true,
  },
};

type WhatToSelectFromPolicy = {
  include: {
    // groups: SelectNameAndIdOnly;
    // users: SelectUserScalarOnly;
    // roles: SelectNameAndIdOnly;
    servicestatements: WhatToSelectFromServiceStatement;
  };
};

export const cWhatToSelectFromPolicy: WhatToSelectFromPolicy = {
  include: {
    // groups: cSelectNameAndIdOnly,
    // users: cSelectUserScalarOnly,
    // roles: cSelectNameAndIdOnly,
    servicestatements: cWhatToSelectFromServiceStatement,
  },
};

export type tPolicy = Prisma.PolicyGetPayload<WhatToSelectFromPolicy>;
export type tPolicyCreate = Prisma.PolicyUncheckedCreateInput;
export type tPolicyUpdate = Prisma.PolicyUncheckedUpdateInput;
