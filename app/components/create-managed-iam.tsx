"use client";

import { useHistorySettings } from "@/hooks/use-history-settings";
import { useEffect, useState } from "react";
import {
  managedGroupInfo,
  managedgroups,
} from "../server/setup/services-and-actions";
import { createGroup } from "../server/groups";
import { tGroupCreate } from "@/lib/prisma-types";

const CreateManagedIam = ({
  start,
  proceed,
}: {
  start: boolean;
  proceed: (value: boolean) => void;
}) => {
  // const { getHistory } = useHistorySettings();

  const createManagedGroup = async (
    _group: string,
    _groupData: managedGroupInfo
  ): Promise<void> => {
    const groupCreation: tGroupCreate = {
      name: _group,
      description: _groupData.description,
    };

    await createGroup(groupCreation);
  };

  const setup = (): void => {
    Object.keys(managedgroups).forEach((group: string) => {
      console.log("Create managed group", group);
      createManagedGroup(group, managedgroups[group]);
    });

    proceed(true);
  };

  useEffect(() => {
    if (start) {
      console.log("Creating Managed IAM entities");
      setup();
    }
  }, [start]);

  return null;
};

export default CreateManagedIam;
