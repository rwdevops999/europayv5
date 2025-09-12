"use client";

import { defineSystemGroups } from "@/app/server/groups";
import { provisionSystemIAM } from "@/app/server/managed";
import { defineSystemPolicies } from "@/app/server/policies";
import { defineSystemRoles } from "@/app/server/roles";
import { defineSystemServiceStatements } from "@/app/server/service-statements";
import { defineSystemUsers } from "@/app/server/users";
import { tServiceStatementCreate } from "@/lib/prisma-types";
import { json } from "@/lib/util";
import Button from "@/ui/button";
import React from "react";

const UploadManaged = () => {
  const handleUploadServiceStatements = async (): Promise<void> => {
    await defineSystemServiceStatements();
  };

  const handleUploadPolicies = async (): Promise<void> => {
    await defineSystemPolicies();
  };

  const handleUploadRoles = async (): Promise<void> => {
    await defineSystemRoles();
  };

  const handleUploadUsers = async (): Promise<void> => {
    await defineSystemUsers();
  };

  const handleUploadGroups = async (): Promise<void> => {
    await defineSystemGroups();
  };

  const handleUploadAll = async (): Promise<void> => {
    console.log("UPLOADING ALL");

    const uploaded: boolean = await provisionSystemIAM();

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
