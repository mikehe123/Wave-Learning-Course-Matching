const fs = require("fs");
const students_reg = JSON.parse(
  fs.readFileSync("import_data/Seminar-Registration.json", "utf-8")
);
const mathced_students = JSON.parse(
  fs.readFileSync("export_data/SeminarAssignments.json", "utf-8")
);
const all_students_profiles = JSON.parse(
  fs.readFileSync("import_data/Student-Profiles.json", "utf-8")
);
const wave_members = JSON.parse(
  fs.readFileSync("import_data/WaveTeamEmails.json", "utf-8")
);
const { current_seminars_targetGrade } = require("./info_func");
const { uuid } = require("uuidv4");
//const late_reg = JSON.parse(fs.readFileSync("late_reg.json", "utf-8"));

//============================Data Joining===========================//
const joined_students_info = students_reg.map((student) => {
  const { email, numSeminars, sem1, sem2, sem3, sem4, sem5, createdAt } =
    student;

  //Find registered students' grade from Student-Profiles.json
  const level = all_students_profiles.filter((complete_profile) => {
    const { email: profileEmail, grade: studentGrade } = complete_profile;

    if (email === profileEmail) {
      return studentGrade;
    }
  });

  const grade = level[0]?.grade || "9";
  const parentEmail = level[0]?.parentEmail || "";
  const studentFirstName = level[0]?.first_name || "";
  const studentSecondName = level[0]?.last_name || "";
  const studentName = `${studentFirstName} ${studentSecondName}`;
  const id = uuid();

  // turn the seminar properties into a map, eliminate repeat courses
  const registered = new Set();
  const courseArr = [sem1, sem2, sem3, sem4, sem5];
  const removedSeminar = ["seminar999"];

  courseArr.forEach((seminar) => {
    if (seminar && !removedSeminar.includes(seminar)) {
      registered.add(seminar);
    }
  });

  return {
    id,
    studentName,
    email,
    parentEmail,
    grade,
    numSeminars,
    registered,
    createdAt,
  };
});

//============================Data Cleaning===========================//

const students_with_no_repeat_account = (JoinedStudentInfo) => {
  console.log(JoinedStudentInfo.length + "origanl data size");
  function findRepeatAccount(repeatedAccounts = []) {
    const allStuEmailset = new Set();
    const allStuEmails = JoinedStudentInfo.map(({ email, id }) => {
      allStuEmailset.add(email);
      return { email, id };
    });
    // console.log(allStuEmails.length + "ahaha");

    while (allStuEmails.length !== 0) {
      const accountInstance = allStuEmails.pop();
      if (!allStuEmailset.delete(accountInstance.email)) {
        repeatedAccounts.push(accountInstance);
      }
    }

    //console.log(repeatedAccounts.length);
    return repeatedAccounts;
  }

  function deleteRepeatAccount(repeatedAccounts, joinedStudentsInfo) {
    // console.log(repeatAccount);
    const repeatID = new Set();
    repeatedAccounts.forEach(({ id }) => {
      repeatID.add(id);
    });
    return joinedStudentsInfo.filter((Student) => {
      const { id: repeatedId } = Student;
      return !repeatID.has(repeatedId);
    });
  }

  const repeatAccount = findRepeatAccount();

  const deletedRepeat = deleteRepeatAccount(repeatAccount, JoinedStudentInfo);
  //console.log(deletedRepeat.length + "!!!!!!!!!!!!!");
  // sepate wave students and regular students
  let normalStudent = [];
  let wave_student = [];
  const wave_member_set = new Set();

  wave_members.forEach(({ teamEmails }) => {
    wave_member_set.add(teamEmails);
  });

  deletedRepeat.forEach((student) => {
    const { email } = student;
    if (wave_member_set.has(email)) {
      wave_student.push(student);
    } else {
      normalStudent.push(student);
    }
  });

  // console.log(normalStudent.length);
  //console.log(wave_student.length);

  return [normalStudent, wave_student];
};

function sortByRegTimeCallback(a, b) {
  var date1 = new Date(Date.parse(a.createdAt));
  var date2 = new Date(Date.parse(b.createdAt));
  if (date1.getTime() >= date2.getTime()) {
    return 1;
  } else if (date1.getTime() <= date2.getTime()) {
    return -1;
  } else {
    return 0;
  }
}

const conflictTimeCoursesParis = [
  ["seminar136", "seminar131"],
  ["seminar135", "seminar140"],
  ["seminar125", "seminar135"],
  ["seminar134", "seminar138"],
  ["seminar134", "seminar127"],
];

function clearStuWhoChooseTimeConflictCourse_helper(arr, conflictPair) {
  const courseArr = arr;
  const sem1 = courseArr.indexOf(conflictPair[0]);
  const sem2 = courseArr.indexOf(conflictPair[1]);
  if (sem1 !== -1 && sem2 !== -1) {
    if (sem1 > sem2) {
      return courseArr.filter((sem) => sem !== conflictPair[1]);
    } else {
      return courseArr.filter((sem) => sem !== conflictPair[0]);
    }
  }

  return arr;
}

function clearStuWhoChooseTimeConflictCourse(arr, allConflictsPairs) {
  //console.log(arr + "Before reduce function")
  const courseArr = allConflictsPairs.reduce(
    clearStuWhoChooseTimeConflictCourse_helper,
    arr
  );

  const arrToMap = new Map();
  courseArr.forEach((sem) => arrToMap.set(sem, false));
  return arrToMap;
}

function filterRegistrationByGrade(target, grade, gradeline = 0) {
  let min = 12;
  let max = 6;

  target.forEach((t) => {
    if (t < min) {
      min = t;
    }
    if (t > max) {
      max = t;
    }
  });

  if (grade.charAt(0) !== ">" || grade.charAt(0) !== "<") {
    if (grade <= max + gradeline && grade >= min - gradeline) {
      return -999;
    } else if (grade > max) {
      return grade - max;
    } else if (grade < min) {
      return min - grade;
    }
  }

  if (grade.charAt(0) == ">") {
    if (max + gradeline >= 12) {
      return -999;
    } else {
      return 12 - max;
    }
  }

  if (grade.charAt(0) == "<") {
    if (min - gradeline <= 6) {
      return -999;
    } else {
      return min - 6;
    }
  }
}

function sortRegistrationByGrade(
  grade,
  registered,
  seminarTargetGrade = current_seminars_targetGrade
) {
  let returnArr = [];
  let sortByGrade = [];
  seminarTargetGrade.forEach((seminar) => {
    registered.forEach((stu_choice) => {
      if (seminar[0] === stu_choice) {
        const gap = filterRegistrationByGrade(seminar[1], grade);
        if (gap !== -999) {
          sortByGrade.push([seminar[0], gap]);
        } else {
          returnArr.push(seminar[0]);
        }
      }
    });
  });
  const finishedSorting = sortByGrade.sort((a, b) => {
    return b[1] - a[1];
  });

  finishedSorting.forEach((e) => {
    returnArr.push(e[0]);
  });
  return returnArr;
}

function setRegistered(
  { grade, registered },
  allConflictsPairs = conflictTimeCoursesParis
) {
  const sortedRegisteredbyGrade = sortRegistrationByGrade(grade, registered);

  //console.log(sortedRegisteredbyGrade + "set Registered")
  return clearStuWhoChooseTimeConflictCourse(
    sortedRegisteredbyGrade,
    allConflictsPairs
  );
}

const packagedStudentInfo = (student) => {
  const { id, studentName, parentEmail, email, createdAt, grade, numSeminars } =
    student;

  const registered = setRegistered(student);

  return {
    id,
    studentName,
    email,
    parentEmail,
    createdAt,
    grade,
    numSeminars,
    registered,
  };
};

const batchStudentByNumSeminar = (regDataOne, regDataTwo) => {
  let batchHolder = [];
  for (let index = 1; index < 6; index++) {
    batchHolder.push(
      regDataOne
        .map((student) => {
          return packagedStudentInfo(student);
        })
        .filter(({ registered }) => {
          return registered.size == index;
        })
        .sort(sortByRegTimeCallback)
    );
  }

  let finalHolder = [];
  for (let index = 1; index < 6; index++) {
    finalHolder.push(
      batchHolder[index - 1].concat(
        regDataTwo
          .map((student) => {
            return packagedStudentInfo(student);
          })
          .filter(({ registered }) => {
            return registered.size == index;
          })
          .sort(sortByRegTimeCallback)
      )
    );
  }

  return finalHolder;
};

const completeClean = students_with_no_repeat_account(joined_students_info);
const complete_batch = batchStudentByNumSeminar(
  completeClean[0],
  completeClean[1]
);

module.exports.stu_batches = complete_batch;
module.exports.filterRegistrationByGrade = filterRegistrationByGrade;
checkBatch(complete_batch);

function checkBatch(batch) {
  let wrong = [];
  let count = 0;
  batch.forEach((SUBGROUP, index) => {
    SUBGROUP.forEach((student) => {
      count++;
      const { registered } = student;
      //   console.log(registered.size + "        " + index);
      //console.log(registered);
      if (registered.size > index + 1 || registered.size < index + 1) {
        wrong.push(student);
      }
    });
  });
  // console.log(wrong);
  // console.log(count);
}

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
// let edInfo = [];
// const ultSet = new Map();
// let countt = 0;
// complete_batch.forEach((Student_group) => {
//   Student_group.forEach(({ email, studentName }) => {
//     ultSet.set(email, studentName);
//   });
// });

// mathced_students.map((MStudent) => {
//   const { student: email, seminar, parentEmail } = MStudent;
//   if (ultSet.has(email)) {
//     let name = ultSet.get(email);
//     edInfo.push({ name, parentEmail });
//   }
// });

// // console.log(
// //   edInfo.sort(function (a, b) {
// //     if (a.seminar < b.seminar) {
// //       return -1;
// //     }
// //     if (a.seminar > b.seminar) {
// //       return 1;
// //     }
// //     return 0;
// //   })
// // );
// console.log(ultSet.size + "countt" + countt);

// fs.writeFile(
//   "export_data/regAssignmentsforEd.json",
//   JSON.stringify(edInfo),
//   "utf8",
//   (err) => {
//     if (err) console.log(err);
//     else {
//       console.log("File written successfully\n");
//     }
//   }
// );
//===================================

const parentEmailSet = new Map();

complete_batch.forEach((Student_group) => {
  Student_group.forEach(({ id, studentName, parentEmail }) => {
    parentEmailSet.set(id, [studentName, parentEmail]);
  });
});

const arr = [...parentEmailSet].map(([studentName, parentEmail]) => {
  let student = parentEmail[0];
  let parent = parentEmail[1];
  return {
    student,
    parent,
  };
});

//console.log(arr.length);
fs.writeFile(
  "export_data/parentEmails.json",
  JSON.stringify(arr),
  "utf8",
  (err) => {
    if (err) console.log(err);
    else {
      console.log("File written successfully\n");
    }
  }
);
