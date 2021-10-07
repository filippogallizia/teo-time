import {}

const coefficient = 0.5;

const matteoSpecialPreferences = [
  {
    date: "DateTime.fromISO('2021-10-05T09:00:00.000')",
    availability: { start: 7, end: '15' },
  },
];

const arrayInitial = [
  { start: 11.5, end: 14 },
  { start: 15, end: 16 },
  { start: 18, end: 21 },
];

const mutationArrayInitial: { start: number; end: number }[] = [];

const closureFunction = (initialState: { start: number; end: number }[]) => {
  const emptyArray: { start: number; end: number }[] = [];
  return function filo() {
    initialState.forEach((objectSlot) => {
      emptyArray.push({
        start: objectSlot.start,
        end: objectSlot.start + coefficient,
      });
      while (
        objectSlot.end > emptyArray[emptyArray.length - 1].end &&
        objectSlot.end - emptyArray[emptyArray.length - 1].end >= coefficient
      ) {
        emptyArray.push({
          start: emptyArray[emptyArray.length - 1].end,
          end: emptyArray[emptyArray.length - 1].end + coefficient,
        });
      }
    });
    return emptyArray;
  };
};

const tim = closureFunction(arrayInitial);

console.log(tim(), 'tim');
