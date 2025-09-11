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
