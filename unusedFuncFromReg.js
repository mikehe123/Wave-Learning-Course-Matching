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


function writeAlternative_reg(stu_database, alt_reg) {
  

  parentEmailMap = new Map();
  const result = [];
  stu_database.forEach((group) => {
    group.forEach(({  parentEmail, email:reg_email  }) => {
      parentEmailMap.set(reg_email,parentEmail)
    });
  }


  alt_reg.forEach(({id:seminar, email:student}) => {
        

    parentEmail = parentEmailMap.get(student)    
    waitlisted = false
    absences = null
    
    result.push({
        seminar,
        waitlisted,
        parentEmail,
        student,
        absences,
      });

  })

  return result;
}

const write_alt_reg = writeAlternative_reg(stu_batches,writeAlternative_reg)

console.log(write_alt_reg)


// const reassignment_by_course_conflicts = compareRegDatabase(registration);

// function isolate_reassign(reassignment_db, pure_emaillist) {
//   let add_db = reassignment_db[1];

//   let isolate_for_alt_db = new Set();
//   add_db.forEach((rstudent) => {
//     const { email } = rstudent;
//     if (pure_emaillist.has(email)) {
//       isolate_for_alt_db.add(rstudent);
//     }
//   });

//   let returnArr = [];
//   isolate_for_alt_db.forEach((e) => {
//     returnArr.push(e);
//   });
//   return returnArr;
// }

// const isolated_reassignment = isolate_reassign(
//   reassignment_by_course_conflicts,
//   pure_student_with_cf
// );

// function writeReAssignment(reassignment_db) {
//   fs.writeFile(
//     `export_data/iso_reassignment_by_course_conflicts.json`,
//     JSON.stringify(reassignment_db),
//     "utf8",
//     (err) => {
//       if (err) console.log(err);
//       else {
//         console.log(`reassignment written successfully\n`);
//       }
//     }
//   );
// }
// function testReAssignment(reassignment_db, iso_db) {
//   let re_db_str = reassignment_db.map((stu) => {
//     return JSON.stringify(stu);
//   });
//   iso_db.forEach((istu) => {
//     let target = JSON.stringify(istu);
//     if (!re_db_str.includes(target)) {
//       console.log("!!!!!!!!!!!!! error");
//     }
//   });

//   console.log("reass db size + iso db size: ");
//   console.log(reassignment_db.length);
//   console.log(iso_db.length);
// }

// testReAssignment(reassignment_by_course_conflicts[1], isolated_reassignment);
// writeReAssignment(isolated_reassignment);
// console.log(isolated_reassignment);

console.log(alternative_reg.length);

// function writeAlternative_reg(stu_database, alt_reg) {
//   parentEmailMap = new Map();
//   const result = [];
//   stu_database.forEach((group) => {
//     group.forEach(({ parentEmail, email: reg_email }) => {
//       parentEmailMap.set(reg_email, parentEmail);
//     });
//   });

//   alt_reg.forEach(({ id: seminar, email: student }) => {
//     parentEmail = parentEmailMap.get(student);
//     waitlisted = false;
//     absences = null;

//     result.push({
//       seminar,
//       waitlisted,
//       parentEmail,
//       student,
//       absences,
//     });
//   });

//   return result;
// }

// const write_alt_reg = writeAlternative_reg(stu_batches, alternative_reg);

// console.log(write_alt_reg);

// writeReAssignment(write_alt_reg);
