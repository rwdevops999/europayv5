"use client";

import { defineGroups } from "@/app/server/groups";
import { definePolicies } from "@/app/server/policies";
import { defineRoles } from "@/app/server/roles";
import { defineServiceStatements } from "@/app/server/service-statements";
import { defineUsers } from "@/app/server/users";
// import { defineServiceStatements } from "@/app/server/service-statements";
import { tServiceStatementCreate } from "@/lib/prisma-types";
import { json } from "@/lib/util";
import Button from "@/ui/button";
import React from "react";

const UploadManaged = () => {
  const handleUploadServiceStatements = async (): Promise<void> => {
    await defineServiceStatements();
  };

  const handleUploadPolicies = async (): Promise<void> => {
    await definePolicies();
  };

  const handleUploadRoles = async (): Promise<void> => {
    await defineRoles();
  };

  const handleUploadUsers = async (): Promise<void> => {
    await defineUsers();
  };

  const handleUploadGroups = async (): Promise<void> => {
    await defineGroups();
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
    </>
  );
  // return <Button name="upload" onClick={testOmit} />;
};

export default UploadManaged;
