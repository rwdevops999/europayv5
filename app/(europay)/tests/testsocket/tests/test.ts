import { absoluteUrl } from "@/lib/util";

export const sendNotification = async (
  _key: string,
  _id: number
): Promise<void> => {
  await fetch(
    absoluteUrl(`/api/notification/send?key=${_key}&value=${_id}&jobid=999`)
  );
};
