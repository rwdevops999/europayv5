import { Permission } from "@/generated/prisma";
import {
  tGroup,
  tPolicy,
  tRole,
  tServiceStatement,
  tServiceStatementAction,
  tUser,
} from "@/lib/prisma-types";

const $iam_statementaction_has_action = (
  _statementaction: tServiceStatementAction,
  _action: string
): boolean => {
  return _statementaction.serviceaction.serviceactionname === _action;
};

const $iam_statements_allow_action = (
  _statements: tServiceStatement[],
  _action: string
): boolean => {
  let allowed: boolean = false;

  for (let statement of _statements) {
    if (statement.permission === Permission.ALLOW) {
      for (let statementaction of statement.servicestatementactions) {
        allowed = $iam_statementaction_has_action(statementaction, _action);
        if (allowed) break;
      }
    }
  }
  return allowed;
};

const $iam_policies_have_action = (
  _policies: tPolicy[],
  _action: string
): boolean => {
  let allowed: boolean = false;

  for (let policy of _policies) {
    allowed ||= $iam_statements_allow_action(policy.servicestatements, _action);
    if (allowed) break;
  }

  return allowed;
};

const $iam_roles_have_action = (_roles: tRole[], _action: string): boolean => {
  let allowed: boolean = false;

  for (let role of _roles) {
    allowed ||= $iam_policies_have_action(role.policies, _action);
    if (allowed) break;
  }

  return allowed;
};

const $iam_groups_have_action = (
  _groups: tGroup[],
  _action: string
): boolean => {
  let allowed: boolean = false;

  for (let group of _groups) {
    allowed ||= $iam_roles_have_action(group.roles, _action);
    if (!allowed) {
      allowed ||= $iam_policies_have_action(group.policies, _action);
    }

    if (allowed) break;
  }
  return allowed;
};

export const $iam_user_has_action = (
  _user: tUser | null,
  _action: string,
  _default: boolean = false
): boolean => {
  let allowed: boolean = false;
  if (_user) {
    allowed ||= $iam_groups_have_action(_user.groups as tGroup[], _action);
    if (!allowed) {
      allowed ||= $iam_roles_have_action(_user.roles, _action);
    }
    if (!allowed) {
      allowed ||= $iam_policies_have_action(_user.policies, _action);
    }
  } else {
    allowed = _default;
  }

  if (!allowed && _default) {
    allowed = _default;
  }

  return allowed;
};
