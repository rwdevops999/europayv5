import { isNumber } from "@/lib/util";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";
import { useSearchParams } from "next/navigation";

export default async function sendHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  const {
    query: { key, value, jobid },
  } = req;

  console.log("[sendHandler]", "KEY = ", key as string);
  console.log("[sendHandler]", "VALUE = ", value);

  const skey: string = key as string;
  const svalue: string = value as string;
  const nvalue: number = parseInt(svalue) as number;
  const sjobid: string = jobid as string;
  const njobid: number = parseInt(sjobid) as number;

  if (key) {
    if (res) {
      if (res.socket) {
        if (res.socket.server) {
          if (res.socket.server.io) {
            console.log("[sendHandler]", "EMIT message", skey, nvalue, njobid);
            const sent: boolean = res.socket.server.io.emit(skey, {
              key: skey,
              value: nvalue,
              jobid: njobid,
            });
            console.log("[sendHandler]", "EMIT message => ", sent);
          }
        }
      }
    }
  }

  return res
    .status(200)
    .json(`SENT key=${skey}, id=${nvalue}, jobId=${njobid}`);
}
