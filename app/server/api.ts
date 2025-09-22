"use server";

import path from "path";
import * as fs from "fs";

export const loadApiContentFromFile = async (
  _filename: string
): Promise<string> => {
  const fullFilename: string =
    process.env.NEXT_PUBLIC_API_HTML_FOLDER + _filename;

  console.log("[fullFilename]", fullFilename);

  const csvFilePath = path.resolve(fullFilename);
  const fileContent = fs.readFileSync(csvFilePath);
  var decoder = new TextDecoder("utf-8");
  const str = decoder.decode(fileContent);

  return str;
};
