"use server";

import { tTemplate } from "@/lib/prisma-types";
import prisma from "@/lib/prisma";
import path from "path";
import * as fs from "fs";
import { SLEEP } from "@/lib/util";

/**
 * Clear template table and reset sequence generator
 */
const resetTemplateTable = async (): Promise<void> => {
  await prisma.$executeRaw`TRUNCATE \"Template\" RESTART IDENTITY`;
};

/**
 * load templates from file
 *
 * @param _filename template.json
 *
 * @returns the file content as string
 */
const loadTemplateContentFromFile = async (
  _filename: string
): Promise<string> => {
  const fullFilename: string =
    process.env.NEXT_PUBLIC_TEMPLATES_FOLDER + _filename;

  const csvFilePath = path.resolve(fullFilename);
  const fileContent = fs.readFileSync(csvFilePath);
  var decoder = new TextDecoder("utf-8");
  const str = decoder.decode(fileContent);

  return str;
};

/**
 * load a template by name
 *
 * @param _name template name
 *
 * @returns  template (tTemplate) or null (if not found)
 */
export const loadTemplateByName = async (
  _name: string
): Promise<tTemplate | undefined> => {
  let result: tTemplate | null = null;

  await prisma.template
    .findFirst({
      where: {
        name: _name,
      },
    })
    .then(async (value: tTemplate | null) => {
      if (value) {
        result = value;
        if (value.fromFile) {
          const content: string | null = await loadTemplateContentFromFile(
            value.content
          );
          result.content = content;
        }
      }
    });

  return result ?? undefined;
};

/**
 * replces template placeholder with parameter values
 *
 * @param _content the template content
 * @param _params the parameters
 *
 * @returns the template content with placeholder replaced by parameter values
 */
export const fillTemplate = async (
  _content: string,
  _params: Record<string, string>
): Promise<string | undefined> => {
  let result: string = _content;

  Object.entries(_params).forEach(([key, value]) => {
    result = result.replaceAll(`\$\{${key}\}`, `${value}`);
  });

  return result;
};

/**
 * Upload the templates from file and store them in the database
 *
 * @param filename : template filename (environment var)
 */
export const uploadTemplates = async (
  filename: string | undefined,
  _clearTable: boolean = true
): Promise<boolean> => {
  let loaded: boolean = false;

  if (_clearTable) {
    await resetTemplateTable().then(() => SLEEP(1000));
  }

  if (filename) {
    const csvFilePath = path.resolve(filename);
    const fileContent = fs.readFileSync(csvFilePath);
    var decoder = new TextDecoder("utf-8");
    let str = decoder.decode(fileContent);
    let templates: tTemplate[] = JSON.parse(str);
    if (templates.length > 0) {
      for (let i = 0; i < templates.length; i++) {
        const template: tTemplate = templates[i];
        await prisma.template.create({
          data: template,
        });
      }
      loaded = true;
    }
  }

  return loaded;
};
