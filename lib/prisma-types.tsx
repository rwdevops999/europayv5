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

/* == SERVICE STATEMENT ACTION ========== */
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
export type tServiceStatementActionCreate =
  Prisma.ServiceStatementActionUncheckedCreateInput;

/* == SERVICE STATEMENT ========== */
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
    groups: SelectNameAndIdOnly;
    users: SelectUserScalarOnly;
    roles: SelectNameAndIdOnly;
    servicestatements: WhatToSelectFromServiceStatement;
  };
};

export const cWhatToSelectFromPolicy: WhatToSelectFromPolicy = {
  include: {
    groups: cSelectNameAndIdOnly,
    users: cSelectUserScalarOnly,
    roles: cSelectNameAndIdOnly,
    servicestatements: cWhatToSelectFromServiceStatement,
  },
};

export type tPolicy = Prisma.PolicyGetPayload<WhatToSelectFromPolicy>;
export type tPolicyCreate = Prisma.PolicyUncheckedCreateInput;
export type tPolicyUpdate = Prisma.PolicyUncheckedUpdateInput;

/* == SETTINGS ========== */
export type tSetting = Prisma.SettingGetPayload<{}>;
export type tSettingCreate = Prisma.SettingUncheckedCreateInput;

/* == ROLE ========== */
type WhatToSelectFromRole = {
  include: {
    groups: SelectNameAndIdOnly;
    users: SelectUserScalarOnly;
    policies: WhatToSelectFromPolicy;
  };
};
export const cWhatToSelectFromRole: WhatToSelectFromRole = {
  include: {
    groups: cSelectNameAndIdOnly,
    users: cSelectUserScalarOnly,
    policies: cWhatToSelectFromPolicy,
  },
};

export type tRole = Prisma.RoleGetPayload<WhatToSelectFromRole>;
export type tRoleCreate = Prisma.RoleUncheckedCreateInput;
export type tRoleUpdate = Prisma.RoleUncheckedUpdateInput;

/* == COUNTRY ========== */
export type WhatToSelectFromCountry = {
  select: {
    id: boolean;
    name: boolean;
    dialCode: boolean;
    currency: boolean;
    currencycode: boolean;
    symbol: boolean;
    code: boolean;
    addresses: boolean;
  };
};
export const cWhatToSelectFromCountry: WhatToSelectFromCountry = {
  select: {
    id: true,
    name: true,
    dialCode: true,
    currency: true,
    currencycode: true,
    symbol: true,
    code: false,
    addresses: false,
  },
};

export type tCountry = Prisma.CountryGetPayload<WhatToSelectFromCountry>;
export type tCountryCreate = Prisma.CountryUncheckedCreateInput;

type WhatToSelectFromAddress = {
  include: {
    country: WhatToSelectFromCountry;
  };
};
const cWhatToSelectFromAddress: WhatToSelectFromAddress = {
  include: {
    country: cWhatToSelectFromCountry,
  },
};

export type tAddress = Prisma.AddressGetPayload<WhatToSelectFromAddress>;

/* == ACCOUNT ========== */
type WhatToSelectFromAccount = {
  include: {
    user: boolean;
    sendertransactions: boolean;
    receivertransactions: boolean;
    bankaccounts: {
      include: {
        account: boolean;
      };
    };
  };
};
export const cWhatToSelectFromAccount: WhatToSelectFromAccount = {
  include: {
    user: true,
    sendertransactions: true,
    receivertransactions: true,
    bankaccounts: {
      include: {
        account: true,
      },
    },
  },
};
export type tAccount = Prisma.AccountGetPayload<WhatToSelectFromAccount>;
export type tAccountCreate = Prisma.AccountUncheckedCreateInput;
export type tAccountUpdate = Prisma.AccountUncheckedUpdateInput;

/* == USERSETTING ========== */
type WhatToSelectFromUsersetting = {
  include: {
    users: boolean;
  };
};
export const cWhatToSelectFromUsersetting: WhatToSelectFromUsersetting = {
  include: {
    users: true,
  },
};
export type tUserSetting =
  Prisma.UserSettingGetPayload<WhatToSelectFromUsersetting>;
export type tUserSettingCreate = Prisma.UserSettingCreateInput;

/* == USER ========== */

type WhatToSelectFromUser = {
  include: {
    address: WhatToSelectFromAddress;
    roles: WhatToSelectFromRole;
    policies: WhatToSelectFromPolicy;
    groups: {
      include: {
        roles: WhatToSelectFromRole;
        policies: WhatToSelectFromPolicy;
        users: boolean;
      };
    };
    account: WhatToSelectFromAccount;
    settings: WhatToSelectFromUsersetting;
  };
};
export const cWhatToSelectFromUser: WhatToSelectFromUser = {
  include: {
    address: cWhatToSelectFromAddress,
    roles: cWhatToSelectFromRole,
    policies: cWhatToSelectFromPolicy,
    groups: {
      include: {
        roles: cWhatToSelectFromRole,
        policies: cWhatToSelectFromPolicy,
        users: false,
      },
    },
    account: cWhatToSelectFromAccount,
    settings: cWhatToSelectFromUsersetting,
  },
};
export type tUser = Prisma.UserGetPayload<WhatToSelectFromUser>;
export type tUserCreate = Prisma.UserUncheckedCreateInput;
export type tUserUpdate = Prisma.UserUncheckedUpdateInput;

/* == GROUP ========== */
type WhatToSelectFromGroup = {
  include: {
    roles: WhatToSelectFromRole;
    policies: WhatToSelectFromPolicy;
    users: WhatToSelectFromUser;
  };
};
export const cWhatToSelectFromGroup: WhatToSelectFromGroup = {
  include: {
    roles: cWhatToSelectFromRole,
    policies: cWhatToSelectFromPolicy,
    users: cWhatToSelectFromUser,
  },
};

export type tGroup = Prisma.GroupGetPayload<WhatToSelectFromGroup>;
export type tGroupCreate = Prisma.GroupUncheckedCreateInput;
export type tGroupUpdate = Prisma.GroupUncheckedUpdateInput;

/* == ACCOUNT APPLY ========== */
export type tAccountApply = Prisma.AccountApplyGetPayload<{}>;
export type tAccountApplyCreate = Prisma.AccountApplyUncheckedCreateInput;

/* == TASK ========== */
type WhatToSelectFromTask = {
  include: {
    predecessorTask: {
      include: {
        predecessorTask: boolean;
        successorTask: boolean;
      };
    };
    successorTask: {
      include: {
        predecessorTask: boolean;
        successorTask: boolean;
      };
    };
  };
};
export const cWhatToSelectFromTask: WhatToSelectFromTask = {
  include: {
    predecessorTask: {
      include: {
        predecessorTask: true,
        successorTask: true,
      },
    },
    successorTask: {
      include: {
        predecessorTask: true,
        successorTask: true,
      },
    },
  },
};

export type tTask = Prisma.TaskGetPayload<WhatToSelectFromTask>;
export type tTaskCreate = Prisma.TaskUncheckedCreateInput;

/* == OTP ========== */
export type tOTP = Prisma.OTPGetPayload<{}>;
export type tOTPCreate = Prisma.OTPUncheckedCreateInput;

/* == HISTORY =========== */
export type tHistory = Prisma.HistoryGetPayload<{}>;

/* == JOBS ========== */
export type tJob = Prisma.JobGetPayload<{}>;
export type tJobCreate = Prisma.JobUncheckedCreateInput;
export type tJobUpdate = Prisma.JobUncheckedUpdateInput;

/* == TRANSACTIONS ========== */
type WhatToSelectFromTransaction = {
  include: {
    receiverAccount: {
      include: {
        user: {
          include: {
            address: {
              include: {
                country: boolean;
              };
            };
          };
        };
      };
    };
    senderAccount: {
      include: {
        user: {
          include: {
            address: {
              include: {
                country: boolean;
              };
            };
            account: {
              include: {
                bankaccounts: boolean;
              };
            };
          };
        };
      };
    };
  };
};

export const cWhatToSelectFromTransaction: WhatToSelectFromTransaction = {
  include: {
    receiverAccount: {
      include: {
        user: {
          include: {
            address: {
              include: {
                country: true,
              },
            },
          },
        },
      },
    },
    senderAccount: {
      include: {
        user: {
          include: {
            address: {
              include: {
                country: true,
              },
            },
            account: {
              include: {
                bankaccounts: true,
              },
            },
          },
        },
      },
    },
  },
};

export type tTransaction =
  Prisma.TransactionGetPayload<WhatToSelectFromTransaction>;
export type tTransactionCreate = Prisma.TransactionUncheckedCreateInput;
export type tTransactionUpdate = Prisma.TransactionUncheckedUpdateInput;

/* == BANK ACCOUNTS ========== */
type WhatToSelectFromBankaccount = {
  include: {
    account: boolean;
  };
};

export const cWhatToSelectFromBankaccount: WhatToSelectFromBankaccount = {
  include: {
    account: true,
  },
};

export type tBankaccount =
  Prisma.BankAccountGetPayload<WhatToSelectFromBankaccount>;
