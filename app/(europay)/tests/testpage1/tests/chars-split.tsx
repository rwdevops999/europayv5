"use client";

import { json } from "@/lib/util";
import Button from "@/ui/button";
import React from "react";

const CharsSplit = () => {
  const testSplit = (): void => {
    let data: string = "30'";

    let chars = data.split("");
    console.log("chars = ", json(chars));
    let tc: string = chars[chars.length - 1];
    console.log("timing char", tc);
    let val = data.split(tc);
    console.log("timing value", val[0]);

    data = "5h";

    chars = data.split("");
    console.log("chars = ", json(chars));
    tc = chars[chars.length - 1];
    console.log("timing char", tc);
    val = data.split(tc);
    console.log("timing value", val[0]);

    data = "3d";

    chars = data.split("");
    console.log("chars = ", json(chars));
    tc = chars[chars.length - 1];
    console.log("timing char", tc);
    val = data.split(tc);
    console.log("timing value", val[0]);
  };

  return <Button name="SPLIT" onClick={testSplit} />;
};

export default CharsSplit;
