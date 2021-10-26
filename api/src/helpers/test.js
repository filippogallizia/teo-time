const _ = require('lodash');

const array1 = [
  { name: 'filo' },
  { name: 'marco' },
  { name: 'gio' },
  { name: 'carlo' },
];
const array2 = [
  { name: 'tim' },
  { name: 'paola' },
  { name: 'gio' },
  { name: 'carlo' },
  { name: 'giuseppe' },
];

const mergeUnique = (arr1, arr2) => {
  const returnArr = [];
  const mergedArr = [...arr1, ...arr2];
  mergedArr.forEach((e) => {
    if (returnArr.findIndex((a) => JSON.stringify(e) == JSON.stringify(a)) < 0)
      returnArr.push(e);
  });
  return returnArr;
};
