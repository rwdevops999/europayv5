"use client";

import { defineManagedGroups } from "@/app/server/groups";
import { provisionManagedIAM } from "@/app/server/managed";
import { defineManagedPolicies } from "@/app/server/policies";
import { defineManagedRoles } from "@/app/server/roles";
import { defineManagedServiceStatements } from "@/app/server/service-statements";
import { defineManagedUsers } from "@/app/server/users";
// import { defineServiceStatements } from "@/app/server/service-statements";
import { tServiceStatementCreate } from "@/lib/prisma-types";
import { json } from "@/lib/util";
import Button from "@/ui/button";
import React from "react";

const UploadManaged = () => {
  const handleUploadServiceStatements = async (): Promise<void> => {
    await defineManagedServiceStatements();
  };

  const handleUploadPolicies = async (): Promise<void> => {
    await defineManagedPolicies();
  };

  const handleUploadRoles = async (): Promise<void> => {
    await defineManagedRoles();
  };

  const handleUploadUsers = async (): Promise<void> => {
    await defineManagedUsers();
  };

  const handleUploadGroups = async (): Promise<void> => {
    await defineManagedGroups();
  };

  const handleUploadAll = async (): Promise<void> => {
    console.log("UPLOADING ALL");

    const uploaded: boolean = await provisionManagedIAM();

    console.log("UPLOADED:", uploaded);
  };

  const testOmit = async (): Promise<void> => {
    let cx: tServiceStatementCreate = {
      ssname: "SSNAME",
      serviceid: 12345,
      description: "DESCRIPTION",
    };

    delete (cx as { serviceid?: number }).serviceid;

    console.log("OMITTED", json(cx));
  };

  return (
    <>
      <Button name="SS" onClick={handleUploadServiceStatements} />
      <Button name="POL" onClick={handleUploadPolicies} />
      <Button name="ROL" onClick={handleUploadRoles} />
      <Button name="USER" onClick={handleUploadUsers} />
      <Button name="GRP" onClick={handleUploadGroups} />
      <Button name="ALL" onClick={handleUploadAll} />
    </>
  );
  // return <Button name="upload" onClick={testOmit} />;
};

export default UploadManaged;
