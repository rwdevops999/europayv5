"use server";

import { tTemplate } from "@/lib/prisma-types";
import prisma from "@/lib/prisma";

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
