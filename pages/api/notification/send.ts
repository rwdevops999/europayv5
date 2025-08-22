import { isNumber } from "@/lib/util";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";
import { useSearchParams } from "next/navigation";

export default async function sendHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  const {
    query: { key, value },
  } = req;

  console.log("[sendHandler]", "NOTIFY CLIENT");
  console.log("[sendHandler]", "KEY = ", key as string);
  console.log("[sendHandler]", "VALUE = ", value);

  const skey: string = key as string;
  const svalue: string = value as string;
  const nvalue: number = parseInt(svalue) as number;

  if (key) {
    if (res) {
      if (res.socket) {
        if (res.socket.server) {
          if (res.socket.server.io) {
            console.log("[sendHandler]", "EMIT message", skey, nvalue);
            const sent: boolean = res.socket.server.io.emit(skey, {
              key: skey,
              value: nvalue,
            });
            console.log("[sendHandler]", "EMIT message => ", sent);
          }
        }
      }
    }
  }

  return res.status(200).json(`SENT key=${skey}, id=${nvalue}`);
}
