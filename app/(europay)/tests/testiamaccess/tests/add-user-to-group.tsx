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

    console.log("User loaded", json(user));

    const userAdded: boolean = await addUserToGroup(2, GROUP_ADMINS);

    console.log("User added", userAdded);
  };

  return (
    <>
      <Button name="Add User" onClick={handleAddUser} />
    </>
  );
};

export default AddUserToGroup;
