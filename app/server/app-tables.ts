"use server";

import prisma from "@/lib/prisma";
import { dbTables, linkedDbTables } from "./data/db-tables";
import { json } from "@/lib/util";

/**
 * clears the table and resets the sequence generator
 *
 * @param _table the table in the DB
 */
const resetTable = async (
  _table: string,
  _cascadedelete: boolean = true
): Promise<void> => {
  if (!_cascadedelete) {
    await prisma
      .$executeRawUnsafe(`DELETE from \"${_table}\"`)
      .then(async () => {
        await prisma.$executeRawUnsafe(
          `ALTER SEQUENCE \"${_table}_id_seq\" RESTART;`
        );
      });
  } else {
    await prisma.$executeRawUnsafe(
      `TRUNCATE \"${_table}\" RESTART IDENTITY CASCADE`
    );
  }
};

/**
 * clear the tables in the db
 *
 * @param _tables array of table names (as stated in dbTables)
 * @param checklinked handle also the tables linked to that table.
 */
export const cleanDbTables = async (
  _tables: string[],
  _checklinked: boolean = true,
  _cascadeDelete: boolean = true
): Promise<void> => {
  for (let i = 0; i < _tables.length; i++) {
    const tableToClean: string = _tables[i];
    const tableName = dbTables[tableToClean];

    await resetTable(tableName, _cascadeDelete);
    if (_checklinked) {
      const linked: string[] | undefined = linkedDbTables[tableToClean];
      if (linked) {
        await cleanDbTables(linked, false, _cascadeDelete);
      }
    }
  }
};
