export const parseHoursToObject = (
  selectedHour: string
): { hours: number; minutes: number } => {
  let flag = false;
  let wasZero = false;
  const result = selectedHour.split('').reduce(
    (acc: any, cv: string) => {
      if (cv === ':') {
        flag = true;
        return acc;
      }
      if (acc.hours.length === 0 && cv === '0') {
        return acc;
      }
      if (acc.hours.length === 2 || wasZero) {
        acc.minutes.push(cv);
        return acc;
      }
      if (acc.hours.length === 1 && flag) {
        acc.minutes.push(cv);
        return acc;
      }
      if (flag) return acc;
      acc.hours.push(cv);
      return acc;
    },
    { hours: [], minutes: [] }
  );
  const minutesInNumber = Number(result.minutes.join(''));
  const hoursInNumber = Number(result.hours.join(''));
  result.minutes = minutesInNumber;
  result.hours = hoursInNumber;
  return result;
};
