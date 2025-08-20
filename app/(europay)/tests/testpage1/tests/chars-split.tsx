"use client";

import { json } from "@/lib/util";
import Button from "@/ui/button";
import React from "react";

const CharsSplit = () => {
  const testSplit = (): void => {
    let data: string = "30'";

    let chars = data.split("");
    let tc: string = chars[chars.length - 1];
    let val = data.split(tc);

    data = "5h";

    chars = data.split("");
    tc = chars[chars.length - 1];
    val = data.split(tc);

    data = "3d";

    chars = data.split("");
    tc = chars[chars.length - 1];
    val = data.split(tc);
  };

  return <Button name="SPLIT" onClick={testSplit} />;
};

export default CharsSplit;
