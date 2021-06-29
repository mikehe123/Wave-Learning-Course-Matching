const fs = require("fs");
const students_reg = JSON.parse(
  fs.readFileSync("import_data/Seminar-Registration.json", "utf-8")
);

const {
  current_seminars_id,
  curr_sem_info,
  update_reg_status,
  courseStatus,
  preRegStats,
} = require("./info_func.js");

const { stu_batches, filterRegistrationByGrade } = require("./batch_students");

const registration = [];
curr_sem_info.forEach(({ id, maxClassSize, targetAudience }) => {
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
    return count < 1 ? true : false;
  } else {
    return count < numSeminars ? true : false;
  }
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
  courseChoice,
  overloadPercentage = 1.5
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
  console.log(preRegStats);
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

function writeSeminarAssignments(presDataResult, fileName = "") {
  fs.writeFile(
    `export_data/${fileName}SeminarAssignments.json`,
    JSON.stringify(presDataResult),
    "utf8",
    (err) => {
      if (err) console.log(err);
      else {
        console.log(`${fileName} written successfully\n`);
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
    // console.log(misMatchRegData);
    // console.log(
    //   registration.forEach(({ id, registered }) => {
    //     console.log(id + " : " + registered);
    //   })
    // );
    // console.log(prev_reg_data_set);
    let newSemAgcount = 0;
    misMatchRegData.forEach(({ id, maxClassSize, registered }) => {
      const changeNum = registered - prev_reg_data_set.get(id);
      newSemAgcount += changeNum;
      console.log(`MaxSize: ${maxClassSize} New: ${changeNum}`);
    });
    console.log("ComReg: Total : " + newSemAgcount + " new assignments");
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

  let newSemAgcount = 0;
  const misMatchRegData = presDataResult.filter(({ student }) => {
    if (!setResult.has(student)) {
      newSemAgcount++;
      // console.log(student);
    }

    return !setResult.has(student);
  });
  console.log("ComSAG: Total : " + newSemAgcount + " new assignments");
}

function checkStuGotFirstChoice(reg_db, after_batch) {
  const pre_batch_first_choice_map = new Map();
  let got_first_sem_count = 0;
  reg_db.forEach(({ sem1, email }) => {
    pre_batch_first_choice_map.set(email, sem1);
  });
  after_batch.forEach((subgroup) => {
    subgroup.forEach(({ registered, email }) => {
      if (pre_batch_first_choice_map.has(email)) {
        let firstChoice = pre_batch_first_choice_map.get(email);
        if (registered.get(firstChoice)) {
          got_first_sem_count++;
        }
      }
    });
  });
  console.log(got_first_sem_count + " students got their first seminar choice");
  return got_first_sem_count;
}

//:::FUnction calls
module.exports.mainAlgorithm = mainAlgorithm;
module.exports.displayFinalRegResult = displayFinalRegResult;
module.exports.resultToJson = resultToJson;
module.exports.splitStudentAssigment = splitStudentAssigment;
module.exports.compareRegDatabase = compareRegDatabase;
module.exports.compareSemAssignments = compareSemAssignments;
module.exports.checkRegStats = checkRegStats;
module.exports.writeSeminarAssignments = writeSeminarAssignments;
module.exports.checkStuGotFirstChoice = checkStuGotFirstChoice;
mainAlgorithm(stu_batches, registration, 5, 5, false);
mainAlgorithm(stu_batches, registration, 5, 5, true);

displayFinalRegResult(registration);

compareRegDatabase(registration);

const upSplitRegResult = resultToJson(stu_batches);
const finalRegResult = splitStudentAssigment(upSplitRegResult);
compareSemAssignments(finalRegResult);
checkRegStats(stu_batches);
checkStuGotFirstChoice(students_reg, stu_batches);
//console.log(finalRegResult);

//::: used
//writeSeminarAssignments(finalRegResult)
//
