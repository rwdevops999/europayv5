import { timings, tTimingGroup } from "./data/timings-data";

export const createCronExpression = (_timing: string): string => {
  let cron: string = `* * * ? * * *`;

  const chars = _timing.split("");

  const value: number = parseInt(chars[0]);
  const timingchar = chars[chars.length - 1];

  const timinggroup: tTimingGroup | undefined = timings.find(
    (timing: tTimingGroup) => timing.char === timingchar
  );

  const now: Date = new Date(Date.now());

  const timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const seconds: number = now.getSeconds();

  if (timinggroup?.group === "minutes") {
    cron = `TZ=${timezone} ${seconds} */${value} * ? * * *`;
  } else {
    const minutes: number = now.getMinutes();
    if (timinggroup?.group === "hours") {
      cron = `TZ=${timezone} ${seconds} ${minutes} */${value} ? * * *`;
    } else {
      const day: number = now.getDate();
      const hours: number = now.getHours();

      if (timinggroup?.group === "days") {
        cron = `TZ=${timezone} ${seconds} ${minutes} ${hours} ${day}/${value} * ? *`;
      }
    }
  }

  return cron;
};

export const createDelayExpression = (_timing: string): string => {
  let delay: string = "";

  const chars = _timing.split("");

  const value: number = parseInt(chars[0]);
  const timingchar = chars[chars.length - 1];

  const timinggroup: tTimingGroup | undefined = timings.find(
    (timing: tTimingGroup) => timing.char === timingchar
  );

  if (value > 1) {
    delay = `${value} ${timinggroup?.group}`;
  } else {
    const timing: string | undefined = timinggroup?.group.slice(
      0,
      timinggroup?.group.length - 1
    );
    delay = `${value} ${timing}`;
  }

  return delay;
};
