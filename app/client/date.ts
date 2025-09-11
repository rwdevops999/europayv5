export const getFirstDayOfThisMonth = (): Date => {
  return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
};

export const getLastDayOfThisMonth = (): Date => {
  return new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
    23,
    59,
    59
  );
};

export const getFirstDayOfPreviousMonth = (): Date => {
  const previousDate: Date = new Date(new Date().setDate(0));
  previousDate.setHours(23);
  previousDate.setMinutes(59);
  previousDate.setSeconds(59);

  return new Date(previousDate.getFullYear(), previousDate.getMonth(), 1);
};

export const getLastDayOfPreviousMonth = (): Date => {
  return new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    0,
    23,
    59,
    59
  );
};
