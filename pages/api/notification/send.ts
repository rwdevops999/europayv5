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

  const skey: string = key as string;
  const svalue: string = value as string;
  const nvalue: number = parseInt(svalue) as number;

  if (key) {
    if (res) {
      if (res.socket) {
        if (res.socket.server) {
          if (res.socket.server.io) {
            const sent: boolean = res.socket.server.io.emit(skey, {
              key: skey,
              value: nvalue,
            });
          }
        }
      }
    }
  }

  return res.status(200).json(`SENT key=${skey}, id=${nvalue}`);
}
