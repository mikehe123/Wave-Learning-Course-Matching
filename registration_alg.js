const fs = require("fs");
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
function filterRegistrationByNumSeminars(
  { registered, numSeminars },
  numSemSwitch
) {
  let count = 0;
  registered.forEach((sem) => {
    if (sem) {
      count++;
    }
  });

  if (!numSemSwitch) {
    if (count < 1) {
      return true;
    }
  } else {
    if (count < numSeminars) {
      return true;
    }
  }
  return false;
}

function updateRegistration(
  stu_database,
  reg_database,
  stopPoint,
  groupNum,
  courseChoice,
  numSemSwitch,
  overloadPercentage = 1.5
) {
  let overflowedStu = [];
  reg_database.forEach((seminar) => {
    stu_database[groupNum].forEach((student) => {
      const { email, studentName, registered, grade } = student;
      const itertor = registered.keys();
      let i = 0;
      while (courseChoice > i) {
        itertor.next();
        i++;
      }
      const temp = itertor.next().value;

      if (temp === seminar.id && registered.get(temp) === false) {
        if (!filterRegistrationByNumSeminars(student, numSemSwitch)) {
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
          // console.log(seminar.id + "is full! Stopped registering");

          overflowedStu.push(student);

          return;
        }
        seminar.registered++;
        registered.set(seminar.id, true);

        seminar.groups.push({ studentName, email });
      }
    });
  });
  //  update_reg_status(reg_database);
  return overflowedStu;
}

function updateRegistrationCustom(
  custom_database,
  reg_database,
  stopPoint,
  courseChoice
) {
  let overflowedStu = [];
  reg_database.forEach((seminar) => {
    custom_database.forEach((student) => {
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
          // console.log(seminar.id + "is full! Stopped registering");
          overflowedStu.push(student);

          return;
        }
        seminar.registered++;
        registered.set(seminar.id, true);
        seminar.groups.push({ studentName, email });
      }
    });
  });
  // update_reg_status(reg_database);
  return overflowedStu;
}

function studentWithNoReg(stu_database, groupNum) {
  let tempHolder = [];
  stu_database[groupNum].forEach((student) => {
    const { registered } = student;
    let countRegCourses = 0;
    registered.forEach((value) => {
      if (value == false) {
        //  console.log(countRegCourses);
        countRegCourses++;
      }
      if (countRegCourses == groupNum + 1) {
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

//=======================Main Alg=========================//

function cleanNoRegPool(
  stu_database,
  reg_database,
  noRegPool,
  groupNum,
  cleanDegree = 5
) {
  if (noRegPool.length !== 0) {
    // console.log("<<-----------------ff----------------->");
    for (let i = 1; i < cleanDegree; i++) {
      if (i == 1) {
        updateRegistrationCustom(noRegPool, reg_database, true, i);
      }
      if (i > 1) {
        updateRegistrationCustom(
          studentWithNoReg(stu_database, groupNum),
          reg_database,
          true,
          i
        );
      }
    }
    // console.log("<-------------------ff--------------->>");
  }
}

function mainAlgorithm(
  stu_database,
  reg_database,
  groups,
  courseChoice,
  numSemSwitch
) {
  if (numSemSwitch === false) {
    updateRegistration(stu_database, reg_database, true, 0, 0, numSemSwitch);
  }

  let noRegPool = [];

  for (let i = 1; i < groups; i++) {
    cleanNoRegPool(stu_database, reg_database, noRegPool, i);

    for (let j = 0; j < courseChoice; j++) {
      if (j <= i) {
        updateRegistration(
          stu_database,
          reg_database,
          true,
          i,
          j,
          numSemSwitch
        );
      }
    }

    noRegPool = studentWithNoReg(stu_database, i);
  }

  cleanNoRegPool(stu_database, reg_database, noRegPool, 4);
}

function checkRegStats(student_database) {
  let count = [];
  let total_reg = 0;
  let best_reg_num = 0;
  student_database.forEach((group) => {
    group.forEach((student) => {
      let pass = false;
      best_reg_num = best_reg_num + student.numSeminars;
      student.registered.forEach((sem) => {
        if (sem === true) {
          total_reg++;
          pass = true;
        }
      });
      if (pass === false) {
        count.push(student);
      }
    });
  });
  if (count.length !== 0) {
    console.log(count);
  }
  console.log("Total regisration number: " + total_reg);
  console.log("Max regisration number: " + best_reg_num);
  console.log(
    "Total capacity: " + total_capacity + " Total Chose: " + total_Chose
  );
}

function resultToJson(stu_database) {
  const result = [];
  stu_database.forEach((group, index) => {
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

      let waitlisted_count = 0;
      const seminarArr = storeCourseNameKey
        .filter((e) => {
          return e[1] === true;
        })
        .map((e) => {
          waitlisted_count++;
          return e[0];
        });

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

function displayFinalRegResult(reg_database) {
  console.log("================Final Registration Result ====================");
  update_reg_status(reg_database);
  console.log("=============================================================");
}

//========Write final registration=====//

function writeSeminarAssignments(presDataResult) {
  fs.writeFile(
    "export_data/SeminarAssignments.json",
    JSON.stringify(presDataResult),
    "utf8",
    (err) => {
      if (err) console.log(err);
      else {
        console.log(`${presDataResult} written successfully\n`);
      }
    }
  );
}

function compareRegDatabase(RegDatabase) {
  const prev_reg_data = JSON.parse(
    fs.readFileSync(
      "intermediate_data/prev_registration_datebase.json",
      "utf-8"
    )
  );

  const prev_reg_data_set = new Map();
  prev_reg_data.forEach(({ id, registered }) => {
    prev_reg_data_set.set(id, registered);
  });

  const misMatchRegData = RegDatabase.filter(({ id, registered }) => {
    return prev_reg_data_set.get(id) !== registered;
  });

  if (misMatchRegData.length !== 0) {
    console.log(misMatchRegData);
    console.log(
      registration.forEach(({ id, registered }) => {
        console.log(id + " : " + registered);
      })
    );
    console.log(prev_reg_data_set);
  }
}

function compareSemAssignments(
  presDataResult,
  readfile = "prev_SeminarAssignments"
) {
  const toCompareRegAss = JSON.parse(
    fs.readFileSync(`intermediate_data/${readfile}.json`, "utf-8")
  );

  const setResult = new Set();
  toCompareRegAss.forEach(({ student }) => {
    setResult.add(student);
  });

  const misMatchRegData = presDataResult.filter(({ student }) => {
    return !setResult.has(student);
  });

  console.log(
    `SemAssignment Comparetion: ${misMatchRegData.size || 0} unmatched`
  );
}

//:::FUnction calls

mainAlgorithm(stu_batches, registration, 5, 5, false);
mainAlgorithm(stu_batches, registration, 5, 5, true);

displayFinalRegResult(registration);

compareRegDatabase(registration);
const upSplitRegResult = resultToJson(stu_batches);
const finalRegResult = splitStudentAssigment(upSplitRegResult);
checkRegStats(stu_batches);

//::: used
//writeSeminarAssignments(finalRegResult)
//compareSemAssignments(finalRegResult);
