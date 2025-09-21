"use client";

import { generatePAT } from "@/lib/util";
import Button from "@/ui/button";
import React from "react";

const TestPAT = () => {
  const handleCreatePAT = (): void => {
    const pat: string = generatePAT();

    console.log("PAT = ", pat);
  };

  return <Button name="create PAT" onClick={handleCreatePAT} />;
};

export default TestPAT;
