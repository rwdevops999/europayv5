"use client";
import { $iam_user_has_action } from "@/app/client/iam-access";
import { loadUserById } from "@/app/server/users";
import { useUser } from "@/hooks/use-user";
import { tUser } from "@/lib/prisma-types";
import { json } from "@/lib/util";
import React, { useEffect } from "react";

const TestUserWithPolicy = () => {
  const { setUser, user } = useUser();

  const loadUser = async (): Promise<void> => {
    const u: tUser | null = await loadUserById(1);

    setUser(u);

    let hasAccess: boolean = false;

    hasAccess = $iam_user_has_action(u, "europay", "View Social Media");

    hasAccess = $iam_user_has_action(u, "europay:socialmedia", "Execute");
  };

  useEffect(() => {
    loadUser();
  }, []);

  return <div>TestUserWithPolicy</div>;
};

export default TestUserWithPolicy;
