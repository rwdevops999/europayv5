import { Group } from "@/generated/prisma";
import {
  tGroup,
  tHistory,
  tJob,
  tPolicy,
  tRole,
  tService,
  tServiceAction,
  tServiceStatement,
  tServiceStatementAction,
  tTask,
  tTransaction,
  tUser,
} from "@/lib/prisma-types";
import { Data, tHistoryData } from "@/lib/types";
import { tTaskData } from "../server/data/taskdata";
import { convertDatabaseDateToString, padZero } from "@/lib/util";
import { JobData } from "../server/data/job-data";
import { tTransactionData } from "../server/data/transaction-data";
import { decode } from "html-entities";

/**
 * map serviceactions to Data
 *
 * @param _serviceactions the serviceactions (tServiceAction[])
 *
 * @returns Data[] the mapped data
 */
export const mapServiceActions = (
  _serviceactions: tServiceAction[]
): Data[] => {
  let result: Data[] = _serviceactions.map((_serviceaction: tServiceAction) => {
    let item: Data = {
      id: _serviceaction.id,
      name: _serviceaction.serviceactionname,
      description: "",
      children: [],
    };

    return item;
  });

  return result;
};

/**
 * map services to Data[]
 *
 * @param _services the services (tService[])
 *
 * @returns Data[] the mapped data (with serviceactions as children)
 */
export const mapServices = (_services: tService[]): Data[] => {
  let result: Data[] = _services.map((_service: tService) => {
    let item: Data = {
      id: _service.id,
      name: _service.servicename,
      description: "",
      children: mapServiceActions(_service.serviceactions),
    };

    return item;
  });

  return result;
};

/**
 * map service statement actions to Data[]
 *
 * @param _servicename the service name of the service statement
 * @param _serviceStatementActions the service statement actions (tServiceStatementAction[])
 * @param _permission the _permisssion (ALLOW or DENY)
 * @param _serviceId the service id
 * @param _parent the service statement
 * @returns
 */
const mapServiceStatementActions = (
  _servicename: string,
  _serviceStatementActions: tServiceStatementAction[],
  _permission: string | null,
  _serviceId: number,
  _parent: string
): Data[] => {
  let result: Data[] = [];

  if (_serviceStatementActions) {
    result = _serviceStatementActions.map(
      (serviceStatementAction: tServiceStatementAction) => {
        return {
          id: serviceStatementAction.id,
          name: serviceStatementAction.ssactionname,
          description: "",
          children: [],
          extra: {
            subject: "ServiceStatementAction",
            parent: _parent,
            access: _permission ?? undefined,
            serviceId: _serviceId ?? undefined,
            action: serviceStatementAction.serviceaction.serviceactionname,
            servicename: _servicename,
          },
        };
      }
    );
  }

  return result;
};

/**
 * map service statements to Data[]
 *
 * @param statements the service statements (tServiceStatement[])
 * @param excludeservicestatementactions boolean to exclue service statment actions
 *
 * @returns Data araay of mapped service statements
 */
export const mapServiceStatements = (
  statements: tServiceStatement[],
  depth: number = 1
): Data[] => {
  let result: Data[] = [];

  if (statements) {
    result = statements.map((statement) => {
      return {
        id: statement.id,
        name: statement.ssname,
        description: statement.description,
        children:
          depth > 0
            ? mapServiceStatementActions(
                statement.service.servicename,
                statement.servicestatementactions,
                statement.permission,
                statement.serviceid,
                statement.ssname
              )
            : [],
        extra: {
          subject: "ServiceStatement",
          parent: undefined,
          serviceId: statement.service.id,
          servicename: statement.service.servicename,
          managed: statement.managed ?? undefined,
          access: statement.permission ?? undefined,
          system: statement.system ?? undefined,
        },
      };
    });
  }

  return result;
};

/**
 * map policies to Data[]. the children are the service statements
 *
 * @param _policies the policies
 * @param _services the services
 *
 * @returns a Data[] array
 */
export const mapPolicies = (
  _policies: tPolicy[],
  _depth: number = 2
): Data[] => {
  let result: Data[] = [];

  if (_policies) {
    let servicename: string;

    result = _policies.map((_policy: tPolicy) => {
      if (_policy.servicestatements.length >= 0) {
        servicename = _policy.servicestatements[0].service.servicename;
      }

      return {
        id: _policy.id,
        name: _policy.name!,
        description: _policy.description,
        children: mapServiceStatements(_policy.servicestatements, _depth - 1),
        extra: {
          subject: "Policy",
          servicename: servicename,
          managed: _policy.managed ?? undefined,
          system: _policy.system ?? undefined,
        },
      };
    });
  }

  return result;
};

let result: Data[] = [];
export const mapRoles = (roles: tRole[], _depth: number = 2): Data[] => {
  if (roles) {
    result = roles.map((role) => {
      return {
        id: role.id,
        name: role.name!,
        description: role.description!,
        children: mapPolicies(role.policies, _depth),
        extra: {
          subject: "Role",
          managed: role.managed ?? undefined,
          system: role.system ?? undefined,
        },
      };
    });
  }

  return result;
};

const mapGroupsSimple = (groups: Group[]): Data[] => {
  let data: Data[] = [];

  data = groups.map((group: Group) => {
    return {
      id: group.id!,
      name: group.name ?? "",
      description: group.description,
      children: [],
      extra: {
        subject: "Group",
      },
    };
  });

  return data;
};

export const mapUsers = (users: tUser[]): Data[] => {
  let data: Data[] = [];

  data = users.map((user: tUser) => {
    return {
      id: user.id!,
      name: user.lastname === "" ? user.email : user.lastname,
      description: user.firstname === "" ? "" : user.firstname,
      children: [
        ...mapPolicies(user.policies),
        ...mapRoles(user.roles),
        ...mapGroupsSimple(user.groups),
      ],
      extra: {
        subject: "User",
        additional: user.blocked,
        managed: user.managed ?? undefined,
        system: user.system ?? undefined,
      },
    };
  });

  return data;
};

const mapUsersSimple = (users: tUser[]): Data[] => {
  let data: Data[] = [];

  data = users.map((user: tUser) => {
    return {
      id: user.id!,
      name: user.lastname === "" ? user.email : user.lastname,
      description: user.firstname === "" ? "" : user.firstname,
      children: [],
      extra: {
        subject: "User",
      },
    };
  });

  return data;
};

export const mapGroups = (groups: tGroup[]): Data[] => {
  let result: Data[] = [];

  result = groups.map((group: tGroup) => {
    return {
      id: group.id,
      name: group.name!,
      description: group.description!,
      children: [
        ...mapPolicies(group.policies),
        ...mapRoles(group.roles),
        ...mapUsersSimple(group.users),
      ],
      extra: {
        subject: "Group",
        managed: group.managed ?? undefined,
        system: group.system ?? undefined,
      },
    };
  });

  return result;
};

export const mapTasks = (tasks: tTask[], size: number = 0): tTaskData[] => {
  let result: tTaskData[] = [];

  if (tasks.length > 0) {
    let slicedTasks: tTask[] = tasks;
    if (size > 0) {
      slicedTasks = slicedTasks.slice(0, size);
    }

    result = slicedTasks.map((task: tTask) => {
      const data: tTaskData = {
        id: task.id,
        taskId: padZero(task.id, 5, "TSK"),
        name: task.name,
        description: task.description,
        status: task.status,
        icons: [],
        children: [],
      };

      if (task.predecessorTask) {
        data.icons?.push("🅿");
      }

      if (task.successorTask) {
        data.icons?.push("🆂");
      }

      return data;
    });
  }

  return result;
};

export const mapHistory = (history: tHistory[] | undefined): tHistoryData[] => {
  let result: tHistoryData[] = [];

  if (history) {
    result = history.map((historyEntry: tHistory) => {
      const data: tHistoryData = {
        title: historyEntry.title ?? "",
        type: historyEntry.type ?? "",
        description: historyEntry.description ?? "",
        originator: historyEntry.originator ?? "",
        date: convertDatabaseDateToString(historyEntry.createDate),
        children: [],
      };

      return data;
    });
  }

  return result;
};

export const mapJobs = (jobs: tJob[]): JobData[] => {
  let result: JobData[] = [];

  if (jobs.length > 0) {
    result = jobs.map((job: tJob) => {
      const jobData: JobData = {
        id: job.id,
        jobId: padZero(job.id, 5, "JOB"),
        name: job.jobname,
        description: job.description,
        status: job.status,
        model: job.model,
      };

      return jobData;
    });
  }

  return result;
};

export const mapTransactions = (
  _transactions: tTransaction[]
): tTransactionData[] => {
  let result: tTransactionData[] = [];

  if (_transactions.length > 0) {
    result = _transactions.map((transaction: tTransaction) => {
      const data: tTransactionData = {
        id: transaction.id,
        transactionId: transaction.transactionid,
        amount:
          transaction.senderAmount.toFixed(2) +
          " " +
          decode(transaction.senderAccount?.user?.address?.country?.symbol) +
          " (" +
          transaction.senderAccount?.user?.address?.country?.currencycode +
          ")",
        sender: transaction.sender!,
        receiver: transaction.receiver!,
        status: transaction.status,
        children: [],
      };

      return data;
    });
  }

  return result;
};
