const {
  current_seminars_id,
  current_seminars_infos,
  checkCourseTimeConflicts,
  update_reg_status,
  courseStatus,
  total_Chose,
  total_capacity,
} = require("./info_func.js");

const { stu_batches, filterRegistrationByGrade } = require("./batch_students");

const registration = [];
current_seminars_infos.forEach(({ id, maxClassSize, targetAudience }) => {
  let registered = 0;

  let groups = [];
  registration.push({
    id,
    targetAudience,
    maxClassSize,
    registered,
    groups,
  });
});

let NumSeminarSwitch = false;
function filterRegistrationByNumSeminars({ registered, numSeminars }) {
  let count = 0;
  registered.forEach((sem) => {
    if (sem == true) {
      count++;
    }
  });
  if (!NumSeminarSwitch) {
    if (count < 1) {
      return true;
    }
  } else {
    if (count < numSeminars) {
      return true;
    }
  }
}
let debug_on_mismatch_reg_number = 0;
let stu_with_misMatch_grade = [];

function updateRegistration(
  stopPoint,
  groupNum,
  courseChoice,
  overloadPercentage = 1.5
) {
  stu_with_misMatch_grade = [];
  let overflowedStu = [];
  registration.forEach((seminar) => {
    stu_batches[groupNum].forEach((student) => {
      const { email, studentName, registered, grade } = student;
      const itertor = registered.keys();
      let i = 0;
      while (courseChoice > i) {
        itertor.next();
        i++;
      }
      const temp = itertor.next().value;
      // let white_swithc = false;
      // let black_swithc = false;
      if (temp === seminar.id && registered.get(temp) === false) {
        if (!filterRegistrationByNumSeminars(student)) {
          return;
        }
        if (
          filterRegistrationByGrade(seminar.targetAudience, grade) !== -999 &&
          groupNum !== 0
        ) {
          return;
        }
        const loadingStopPoint = seminar.maxClassSize * overloadPercentage;
        if (stopPoint === true && seminar.registered >= loadingStopPoint) {
          console.log(seminar.id + "is full! Stopped registering");

          overflowedStu.push(student);
          //  white_swithc = true;
          return;
        }
        seminar.registered++;
        registered.set(seminar.id, true);
        if (email === "varly247@gmail.com") {
          console.log("bug");
        }
        seminar.groups.push({ studentName, email });
        //    debug_on_mismatch_reg_number++;
      }
    });
  });
  update_reg_status(registration);
  return overflowedStu;
}

function updateRegistrationCustom(stopPoint, customGroup, courseChoice) {
  let overflowedStu = [];
  registration.forEach((seminar) => {
    customGroup.forEach((student) => {
      const { studentName, email, registered } = student;

      const itertor = registered.keys();
      let i = 0;
      while (courseChoice > i) {
        itertor.next();
        i++;
      }
      const temp = itertor.next().value;

      if (temp === seminar.id && registered.get(temp) === false) {
        if (stopPoint === true && seminar.registered >= seminar.maxClassSize) {
          console.log(seminar.id + "is full! Stopped registering");
          overflowedStu.push(student);
          //   white_swithc = true;
          return;
        }
        seminar.registered++;
        registered.set(seminar.id, true);
        seminar.groups.push({ studentName, email });
        //    debug_on_mismatch_reg_number++;
      }
    });
  });
  update_reg_status(registration);
  return overflowedStu;
}
// console.log(registration[0]);
// console.log(stu_batches[4]);
//update registration by student batch and their choices

function MassUpdate(stopPoint, batchGroups, batchChoices) {
  for (let i = 0; i < batchGroups; i++) {
    for (let j = 0; j < batchChoices; j++) {
      updateRegistration(stopPoint, i, j);
    }
  }
}

// check current registration status

// get all registration by emails and check the registration size.
const allseminarEmail = ({ groups }) => {
  let emailList = [];
  groups.forEach((subgroup) => {
    subgroup.forEach((email) => {
      emailList.push(email);
    });
  });
  return emailList;
};

const total_course_regisration = registration.reduce((total, seminar) => {
  return total + allseminarEmail(seminar).length;
}, 0);
//console.log(total_course_regisration);
function studentWithNoReg(groupNum) {
  let tempHolder = [];
  stu_batches[groupNum].forEach((student) => {
    const { registered } = student;
    let count = 0;
    registered.forEach((value) => {
      if (value == false) {
        // console.log(count);
        count++;
      }
      if (count == groupNum + 1) {
        tempHolder.push(student);
      }
    });
  });
  if (tempHolder.length == 0) {
    console.log(
      `=========${tempHolder.length} student of group ${
        groupNum + 1
      } are not being registered=========`
    );
    console.log(tempHolder);
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
  } else {
    console.log(
      `=========${tempHolder.length} student of group ${
        groupNum + 1
      } are not being registered=========`
    );
  }
  return tempHolder;
}
//=============variable=============
//stu_with_misMatch_grade
//=======================Main Alg=========================//
//MassUpdate(false, 2, 1);

function cleanNoRegPool(noRegPool, groupNum, cleanDegree = 5) {
  if (noRegPool.length !== 0) {
    // console.log("<<-----------------ff----------------->");
    for (let i = 1; i < cleanDegree; i++) {
      if (i == 1) {
        updateRegistrationCustom(true, noRegPool, i);
      }
      if (i > 1) {
        updateRegistrationCustom(true, studentWithNoReg(groupNum), i);
      }
    }
    // console.log("<-------------------ff--------------->>");
  }
}

function mainAlgorithm(groups, courseChoice) {
  if (NumSeminarSwitch === false) {
    updateRegistration(true, 0, 0);
  }

  let noRegPool = [];

  for (let i = 1; i < groups; i++) {
    cleanNoRegPool(noRegPool, i);
    let misMatchPool = [];
    for (let j = 0; j < courseChoice; j++) {
      if (j <= i) {
        updateRegistration(true, i, j);
        misMatchPool.push(stu_with_misMatch_grade);
      }
    }

    let intersectMisMatchPool = misMatchPool.reduce((a, b) =>
      a.filter((c) => b.includes(c.email))
    );

    updateRegistrationCustom(true, intersectMisMatchPool, 0);
    noRegPool = studentWithNoReg(i);
  }

  cleanNoRegPool(noRegPool, 4);
}

mainAlgorithm(5, 5);
NumSeminarSwitch = true;
mainAlgorithm(5, 5);

console.log("================Final Registration Result ====================");
update_reg_status(registration);
// console.log(
//   "~~~~~~~~~~~~~~~~~~~~Preprocessed registration~~~~~~~~~~~~~~~~~~~~~~~~"
// );
// console.log(courseStatus);
// console.log("================================================================");
//=============experiment enhanceUpdate==================//
// function enhancedUpdate(stopPoint, batchGroups, batchChoices) {
//   for (let i = 0; i < batchGroups; i++) {
//     for (let j = 0; j < batchChoices; j++) {
//       // registration.forEach((seminar) => {
//       updateRegistration(stopPoint, registration[11], i, j);
//       // });
//     }
//   }
// }

// enhancedUpdate(false, 5, 5);
// console.log(registration[11]);

// const allStudentsEmail = (stu_batches, courseName) => {
//   let emailList = [];
//   stu_batches.forEach((batch_test) => {
//     batch_test.forEach((student) => {
//       if (student.registered.get(courseName) === true) {
//         emailList.push(student.email);
//       }
//     });
//   });
//   return emailList;
// };
let count = [];
let total_reg = 0;
let best_reg_num = 0;
stu_batches.forEach((group) => {
  group.forEach((student) => {
    let pass = false;
    best_reg_num = best_reg_num + student.numSeminars;
    student.registered.forEach((sem) => {
      if (sem === true) {
        total_reg++;
        pass = true;
      }
    });
    if (pass !== true) {
      count.push(student);
    }
  });
});
console.log(count);
console.log("Total regisration number: " + total_reg);
console.log("Max regisration number: " + best_reg_num);
console.log(
  "Total capacity: " + total_capacity + " Total Chose: " + total_Chose
);

let total_match_count = 0;
function resultToJson(stu_batches) {
  const result = [];
  stu_batches.forEach((group, index) => {
    group.forEach(({ id, parentEmail, email, registered, numSeminars }) => {
      let storeCourseNameKey = [];
      let mapIter = registered.entries();
      for (let i = 0; i < index; i++) {
        let key = mapIter.next().value;
        storeCourseNameKey.push(key);
      }
      let lastkey = mapIter.next().value;
      storeCourseNameKey.push(lastkey);

      let waitlisted = false;
      //console.log(storeCourseNameKey);
      let waitlisted_count = 0;
      const seminarArr = storeCourseNameKey
        .filter((e) => {
          return e[1] === true;
        })
        .map((e) => {
          waitlisted_count++;
          return e[0];
        });

      total_match_count = total_match_count + seminarArr.length;

      //console.log(waitlisted_count + "  " + numSeminars);
      if (waitlisted_count < numSeminars) {
        waitlisted = true;
      }
      let student = email;

      let absences = null;
      result.push({
        id,
        seminarArr,
        waitlisted,
        parentEmail,
        student,
        absences,
      });
    });
  });
  return result;
}

let regResultWithAllAssignCourses = resultToJson(stu_batches);
exports.regResultWithAllAssignCourses = regResultWithAllAssignCourses;
function splitStudentAssigment(unsplitedRes) {
  let finalResult = [];
  unsplitedRes.forEach((Student) => {
    const { id, seminarArr, waitlisted, parentEmail, student, absences } =
      Student;

    let seminar = seminarArr[0];
    finalResult.push({
      id,
      seminar,
      waitlisted,
      parentEmail,
      student,
      absences,
    });

    if (seminarArr.length === 2) {
      seminar = seminarArr[1];
      finalResult.push({
        id,
        seminar,
        waitlisted,
        parentEmail,
        student,
        absences,
      });
    }
  });

  return finalResult;
}
const finalRegistrationResult = splitStudentAssigment(
  regResultWithAllAssignCourses
);
console.log(total_match_count + " NUMBER OF FINAL STUDENTS");
console.log(finalRegistrationResult.length + " NUMBER OF FINAL STUDENTS");
//========Write final registration=====//
// const fs = require("fs");
// fs.writeFile(
//   "export_data/SeminarAssignments.json",
//   JSON.stringify(finalRegistrationResult),
//   "utf8",
//   (err) => {
//     if (err) console.log(err);
//     else {
//       console.log("File written successfully\n");
//     }
//   }
// );

//-------------------------------------------------------------------------------
//========Write final registration=====//
// const fs = require("fs");
// fs.writeFile(
//   "registration_info_per_seminar.json",
//   JSON.stringify(registration),
//   "utf8",
//   (err) => {
//     if (err) console.log(err);
//     else {
//       console.log("File written successfully\n");
//     }
//   }
// );

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
