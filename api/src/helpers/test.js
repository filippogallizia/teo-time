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

// console.log(mergeUnique(array1, array2));

// console.log(_.unionBy(array1, array2, 'name'));

// console.log(_.unionWith(array1, array2, _.isEqual));
console.log(_.xorWith(array1, array2, (v, y) => v.name !== y.name));

// const fn = (array1, array2) => {
//   const bucket = [];
//   array1.forEach((a1) => {
//     array2.forEach((a2) => {
//       if (a2.name !== a1.name) {
//         if (bucket.find((b) => b.name === a1.name)) return;
//         else bucket.push(a1);
//       }
//     });
//   });
//   return bucket;
// };

// const result1 = fn(array1, array2);
// // const result1 = fn(array1, array1)

// console.log(result1, 'result');
