// check current registration status

// get all registration by emails and check the registration size.
// const allseminarEmail = ({ groups }) => {
//   let emailList = [];
//   groups.forEach((subgroup) => {
//     subgroup.forEach((email) => {
//       emailList.push(email);
//     });
//   });
//   return emailList;
// };

// const total_course_regisration = registration.reduce((total, seminar) => {
//   return total + allseminarEmail(seminar).length;
// }, 0);

function MassUpdate(reg_database, stopPoint, batchGroups, batchChoices) {
  for (let i = 0; i < batchGroups; i++) {
    for (let j = 0; j < batchChoices; j++) {
      updateRegistration(reg_database, stopPoint, i, j);
    }
  }
}

//=============experiment enhanceUpdate==================//
// function enhancedUpdate(stopPoint, batchGroups, batchChoices) {
//   for (let i = 0; i < batchGroups; i++) {
//     for (let j = 0; j < batchChoices; j++) {
//       // registration.forEach((seminar) => {
//       updateRegistration(registration,stopPoint, registration[11], i, j);
//       // });
//     }
//   }
// }

//============print out student data per seminar========//
// let copy_reg = registration;
// copy_reg.forEach((seminar) => {
//   seminar.registered = 0;
// });
// regResultWithAllAssignCourses.forEach((student) => {
//   const { seminarArr } = student;
//   seminarArr.forEach((seminarName) => {
//     copy_reg.forEach((seminar) => {
//       if (seminarName == seminar.id) {
//         seminar.registered++;
//       }
//     });
//   });
// });
// update_reg_status(copy_reg);

// let group_length = [];
// let studentlist = registration.reduce((total, sem) => {
//   const { groups } = sem;
//   group_length.push(groups.length);
//   return total + groups.length;
// }, 0);
// console.log(registration.length);

// let group_num_count = 0;
// group_length.forEach((e) => {
//   group_num_count = group_num_count + e;
// });
// console.log(group_num_count);
// console.log(
//   group_length.sort((a, b) => {
//     return b - a;
//   })
// );

// let misCount = 0;
// let correctCount = 0;
// let temp_id = registration[3].id;

// registration.findIndex((e) => {
//   return e.id === "seminar134";
// });
// console.log(registration[3]);
// finalRegistrationResult.forEach((Student) => {
//   if (Student.seminar.includes("seminar134")) {
//     console.log(Student.student);
//   }
// });

// console.log(misCount + " mis count here");
// console.log(correctCount + " correct count here");
// console.log(debug_on_mismatch_reg_number + " debug on mistmatch");

//-------------------------------------------------------------------------------
//========Write final registration databse =====//
