export type tTimingGroup = {
  group: string;
  char: string;
  accumulator: number;
  notation: string;
  values: number[];
};

export const timings: tTimingGroup[] = [
  {
    group: "minutes",
    char: "'",
    notation: "&apos;",
    accumulator: 60 * 1000,
    values: [5, 10, 30],
  },
  {
    group: "hours",
    char: "h",
    notation: "&#x02B0;",
    accumulator: 60 * 60 * 1000,
    values: [1, 3, 6],
  },
  {
    group: "days",
    char: "d",
    notation: "&#x1D48;",
    accumulator: 24 * 60 * 60 * 1000,
    values: [1, 3, 5, 15, 30],
  },
];
