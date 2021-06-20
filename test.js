//const arr = [9, 9, 9, 9, 9];

// console.log(arr.indexOf(0));

// // if (-1 !== arr.indexOf(2) && -1 !== arr.indexOf(8)) {
// //   return console.log("true");
// // } else {
// //   return console.log("false");
// // }

// arr.map((element, index) => {
//   console.log(index + 1);
//   return index;
// });

// function filterRegistrationByGrade(target, grade) {
//   let min = 9;
//   let max = 9;
//   target.forEach((t) => {
//     if (t < min) {
//       min = t;
//     }
//     if (t > max) {
//       max = t;
//     }
//   });
//   if (grade.charAt(0) !== ">" || grade.charAt(0) !== "<") {
//     if (grade <= max && grade >= min) {
//       return "match";
//     } else if (grade > max) {
//       return grade - max;
//     } else if (grade < min) {
//       return min - grade;
//     }
//     if (grade.charAt(0) == ">") {
//       if (max == 12) {
//         return "match";
//       } else {
//         return 12 - max;
//       }
//     }

//     if (grade.charAt(0) == "<") {
//       if (min == 6) {
//         return "match";
//       } else {
//         return min - 6;
//       }
//     }
//   }
// }

// function sortRegistrationByGrade(grade, arr) {
//   const returnArr = [];
//   const sortByGrade = [];
//   example.forEach((seminar) => {
//     arr.forEach((stu_choice) => {
//       if (seminar[0] === stu_choice) {
//         const gap = filterRegistrationByGrade(seminar[1], grade);
//         if (gap !== "match") {
//           sortByGrade.push([seminar[0], gap]);
//         } else {
//           returnArr.push(seminar[0]);
//         }
//       }
//     });
//   });
//   const finishedSorting = sortByGrade.sort((a, b) => {
//     b[1] - a[1];
//   });

//   finishedSorting.forEach((e) => {
//     returnArr.push(e[0]);
//   });
//   return returnArr;
// }

// const studentGrade = "8";
// const example = [
//   ["101", [7, 8, 9]],
//   ["102", [12]],
//   ["103", [6]],
//   ["104", [2]],
// ];
// let studentChoice = ["101", "102", "103"];

// studentChoice = sortRegistrationByGrade(studentGrade, studentChoice);
// console.log(studentChoice);

// const target = [7, 8, 9];
// const target2 = [6, 12];
// const grade = "> 12";
// const grade2 = "< 6";
// const grade3 = "9";
// if (!filterRegistrationByGrade(target, grade)) {
//   console.log("success");
// }
// const result1 = filterRegistrationByGrade(target, grade);
// const result2 = filterRegistrationByGrade(target, grade2);
// const result3 = filterRegistrationByGrade(target, grade3);

// console.log(result1 === "match");

// console.log(result3 === "match");
// const array1 = [1, 2, 2, 2, 2];
// const array2 = [1, 3, 4, 5];
// const dataarr = [array1, array2];
// result = dataarr.reduce((a, b) => a.filter((c) => b.includes(c)));

// console.log(result);
// const array5 = [];
// if (array5 == undefined) {
//   console.log("array5 is null");
// }

let num = 1;

function multiply(a, b) {
  return a * b;
}
module.exports.multiply = multiply;

const multiply2 = (a, b) => {
  return a * b;
};
exports.multiply2 = multiply2;

exports.mutliply3 = function multiply3(a, b) {
  return a * b;
};
num = 10;
exports.nub = num;

// module.exports = { hello: "what's up!", multiply, multiply2 };
//console.log(exports);
//aaabbbccc
//fesdrtybb

let arrA = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
let arrB = ["a", "b", "c", "d", "e", "f", "g", "h"];

const result = arrA.forEach((numArr) => {
  let z = numArr.filter((num) => {
    return num > 4;
  });
  console.log(z);
});

console.log(result);
