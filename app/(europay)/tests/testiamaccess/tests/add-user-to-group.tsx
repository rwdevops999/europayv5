"use client";

import { addUserToGroup } from "@/app/server/groups";
import { loadUserById } from "@/app/server/users";
import { GROUP_ADMINS } from "@/lib/constants";
import { tUser } from "@/lib/prisma-types";
import { json } from "@/lib/util";
import Button from "@/ui/button";

const AddUserToGroup = () => {
  const handleAddUser = async (): Promise<void> => {
    const user: tUser | null = await loadUserById(1);

    const userAdded: boolean = await addUserToGroup(1, GROUP_ADMINS);
  };

  return (
    <>
      <Button name="Add User" onClick={handleAddUser} />
    </>
  );
};

export default AddUserToGroup;
