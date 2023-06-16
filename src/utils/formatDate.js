export const getPeriod = (startDate, endDate) => {
  const timeDiff = Math.abs(
    new Date(endDate).getTime() - new Date(startDate).getTime()
  );
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return diffDays;
};
