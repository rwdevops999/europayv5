import { Permission } from "@/generated/prisma";
import {
  tGroup,
  tPolicy,
  tRole,
  tServiceStatement,
  tServiceStatementAction,
  tUser,
} from "@/lib/prisma-types";
import { json } from "@/lib/util";

const $iam_statementaction_has_action = (
  _statementaction: tServiceStatementAction,
  _action: string
): boolean => {
  return _statementaction.serviceaction.serviceactionname === _action;
};

const $iam_statements_allow_action = (
  _statements: tServiceStatement[],
  _service: string,
  _action: string
): boolean => {
  let allowed: boolean = false;

  let i = 0;
  while (!allowed && i < _statements.length) {
    let statement: tServiceStatement = _statements[i];
    if (
      statement.permission === Permission.ALLOW &&
      statement.service.servicename === _service
    ) {
      let j = 0;
      while (!allowed && j < statement.servicestatementactions.length) {
        let statementaction: tServiceStatementAction =
          statement.servicestatementactions[j];
        allowed = $iam_statementaction_has_action(statementaction, _action);
        j++;
      }
    }

    i++;
  }

  return allowed;
};

const $iam_policies_have_action = (
  _policies: tPolicy[],
  _service: string,
  _action: string
): boolean => {
  let allowed: boolean = false;

  let i = 0;

  while (!allowed && i < _policies.length) {
    let policy: tPolicy = _policies[i];

    allowed ||= $iam_statements_allow_action(
      policy.servicestatements,
      _service,
      _action
    );

    i++;
  }

  return allowed;
};

const $iam_roles_have_action = (
  _roles: tRole[],
  _service: string,
  _action: string
): boolean => {
  let allowed: boolean = false;

  let i = 0;
  while (!allowed && i < _roles.length) {
    let role: tRole = _roles[i];

    allowed ||= $iam_policies_have_action(role.policies, _service, _action);

    i++;
  }

  return allowed;
};

const $iam_groups_have_action = (
  _groups: tGroup[],
  _service: string,
  _action: string
): boolean => {
  let allowed: boolean = false;

  let i = 0;

  while (!allowed && i < _groups.length) {
    let group: tGroup = _groups[i];

    allowed ||= $iam_roles_have_action(group.roles, _service, _action);
    if (!allowed) {
      allowed ||= $iam_policies_have_action(group.policies, _service, _action);
    }

    i++;
  }

  return allowed;
};

export const $iam_user_has_action = (
  _user: tUser | null,
  _service: string,
  _action: string,
  _default: boolean = false
): boolean => {
  let allowed: boolean = false;
  if (_user) {
    allowed ||= $iam_groups_have_action(
      _user.groups as tGroup[],
      _service,
      _action
    );
    if (!allowed) {
      allowed ||= $iam_roles_have_action(_user.roles, _service, _action);
    }
    if (!allowed) {
      allowed ||= $iam_policies_have_action(_user.policies, _service, _action);
    }
  } else {
    allowed = _default;
  }

  if (!allowed && _default) {
    allowed = _default;
  }

  return allowed;
};
