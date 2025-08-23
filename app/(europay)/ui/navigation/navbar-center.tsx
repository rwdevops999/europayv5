"use client";
import React, { useEffect, useState } from "react";
import NavbarMenu from "./components/navbar-menu";
import { menu } from "./components/menu";
import { $iam_user_has_action } from "@/app/client/iam-access";
import { useUser } from "@/hooks/use-user";

const NavbarCenter = () => {
  const { user } = useUser();

  useEffect(() => {
    console.log("Setting Menu Visibilities");
  }, []);

  return (
    <div data-testid="navbar-center">
      <NavbarMenu />
    </div>
  );
};

export default NavbarCenter;
