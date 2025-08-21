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

    console.log("USER LOADED", json(u));

    let hasAccess: boolean = false;
    console.log("Has Access: start", hasAccess);

    hasAccess = $iam_user_has_action(u, "Goto Home");
    console.log("Has Access: Goto Home", hasAccess);

    hasAccess = $iam_user_has_action(u, "View Dashboard");
    console.log("Has Access: View Dashboard", hasAccess);

    hasAccess = $iam_user_has_action(u, "Login");
    console.log("Has Access: Login", hasAccess);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return <div>TestUserWithPolicy</div>;
};

export default TestUserWithPolicy;
