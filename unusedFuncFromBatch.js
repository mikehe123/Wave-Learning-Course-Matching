//-------------------Optional methods------------------------------//
// function filterStudentByCourse(seminar1, seminar2) {
//   let studentChooseConflicTimeCourses = [];
//   batches.forEach((subGroup) => {
//     subGroup.forEach((student) => {
//       if (
//         student.registered.has(seminar1) &&
//         student.registered.has(seminar2)
//       ) {
//         const return_object = [student, seminar1, seminar2];
//         studentChooseConflicTimeCourses.push(return_object);
//       }
//     });
//   });
//   return studentChooseConflicTimeCourses;
// }

// const numStuChooseTCC = conflictTimeCoursesParis.reduce((total, pair) => {
//   return total + filterStudentByCourse(pair[0], pair[1]).length;
// }, 0);

// const StuChooseTCC = () =>
//   conflictTimeCoursesParis.forEach((pair) => {
//     console.log(filterStudentByCourse(pair[0], pair[1]));
//   });
//console.log(filterStudentByCourse("seminar136", "seminar131").length);
//----------------------------------------------------------------//

//console.log(temp_batches);

//=======================wait list student ============================//
// let waitListedStudent = [];
// let tempbatch = complete_batch;
// tempbatch.forEach((Subgroup) => {
//   Subgroup.forEach((Student) => {
//     const { email, registered, studentName } = Student;

//     mathced_students.forEach((MStudent) => {
//       const { student, waitlisted, seminar } = MStudent;
//       let Memail = student;

//       if (Memail == email && waitlisted && registered.size > 1) {
//         registered.delete(seminar);

//         let mapIter = registered.entries();
//         let secondSeminar = mapIter.next().value[0];

//         waitListedStudent.push({ studentName, email, secondSeminar });
//       }
//     });
//   });
// });
// // //=======================-----------------============================//
// console.log(waitListedStudent.length + " walited student length");

// fs.writeFile(
//   "waitlistedStudentsWithSecSeminar.json",
//   JSON.stringify(waitListedStudent),
//   "utf8",
//   (err) => {
//     if (err) console.log(err);
//     else {
//       console.log("File written successfully\n");
//     }
//   }
// );
//{"id":"c3057621-0017-40b2-9943-22111868e335","seminar":"seminar138","waitlisted":false,"parentEmail":"minmou@gmail.com","student":"minmou@gmail.com","absences":null},

// --------------------Edit info------------

//===================================
