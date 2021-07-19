const fs = require("fs");

let seminars_info = JSON.parse(
  fs.readFileSync("import_data/Seminars_Info.json", "utf-8")
);

//get all current seminars name
function get_curr_seminar_id(SemReg_db) {
  const current_seminars_id = new Set();
  SemReg_db.forEach(({ sem1, sem2, sem3, sem4, sem5 }) => {
    current_seminars_id.add(sem1);
    current_seminars_id.add(sem2);
    current_seminars_id.add(sem3);
    current_seminars_id.add(sem4);
    current_seminars_id.add(sem5);
  });
  current_seminars_id.delete("");
  current_seminars_id.delete("seminar999");

  return current_seminars_id;
}

//console.log(current_seminars_id);

//get current seminars's info

function get_curr_sem_info(SemInfo_db, curr_sem_id) {
  const current_seminars_infos = new Set();
  SemInfo_db.forEach(
    ({
      id,
      classTimes,
      classDays,
      maxClassSize,
      targetAudience,
      courseTitle,
    }) => {
      if (curr_sem_id.has(id)) {
        current_seminars_infos.add({
          id,
          classTimes,
          classDays,
          maxClassSize,
          targetAudience,
          courseTitle,
        });
      }
    }
  );
  return current_seminars_infos;
}

function get_curr_sem_targetGrade(curr_semInfo_db) {
  const current_seminars_targetGrade = [];
  curr_semInfo_db.forEach((seminar) => {
    let name = seminar.id;
    current_seminars_targetGrade.push([name, seminar.targetAudience]);
  });
  return current_seminars_targetGrade;
}

//console.log(current_seminars_targetGrade);
//check conflicts time
//console.log(current_seminars_targetGrade);
function checkCourseTimeConflicts(semInfo_db) {
  let conflictCourseArr = [];
  let time = 1;
  while (time != 13) {
    console.log("==============Group" + time + "==================");
    semInfo_db.forEach(({ id, classTimes, classDays }) => {
      let time_string = time.toString();

      if (classTimes.includes(time_string)) {
        conflictCourseArr.push({ id, classTimes, classDays });
        console.log({ id, classTimes, classDays });
      }
    });
    time++;
  }
  return conflictCourseArr;
}

function timeValue(t) {
  let input = 0;
  let hour = parseFloat(t.split(":")[0]);
  let min = parseFloat(t.split(":")[1]);

  if (hour == 12) {
    hour = 0;
  }

  if (min != "0") {
    input = hour + parseFloat(min) * 0.01;
  } else {
    input = hour;
  }
  return input;
}

function isOverlap(stringTime1, stringTime2) {
  let t1 = stringTime1.split(" - ");
  let t2 = stringTime2.split(" - ");

  let sT = timeValue(t1[0]);
  let eT = timeValue(t1[1]);

  let sT2 = timeValue(t2[0]);
  let eT2 = timeValue(t2[1]);

  // console.log(sT, eT, sT2, eT2);
  return sT < eT2 && sT2 < eT;
}

function courseConflictsPairs(semInfo_db) {
  let groupCourseByDay = [];
  let weekDays = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
  weekDays.forEach((day) => {
    let dayCourseGroup = [];
    semInfo_db.forEach((course) => {
      const { classDays } = course;
      if (classDays.includes(day)) {
        dayCourseGroup.push(course);
      }
    });
    groupCourseByDay.push(dayCourseGroup);
  });

  let conflictsPairs = [];
  groupCourseByDay.forEach((dayCourseGroup) => {
    dayCourseGroup.forEach((courseA) => {
      const { id: courseAId, classTimes: t1 } = courseA;
      dayCourseGroup.forEach((courseB) => {
        const { id: courseBId, classTimes: t2 } = courseB;
        if (courseA != courseB) {
          if (isOverlap(t1, t2)) {
            conflictsPairs.push([courseAId, courseBId]);
          }
        }
      });
    });
  });

  return conflictsPairs;
}
//check what seminars are overloaded;

const checkOverloadedCourses = (cur_sem_info, SemReg_db) => {
  let overloadInfo = [];
  cur_sem_info.forEach(({ id, maxClassSize }) => {
    let overload = 0;
    SemReg_db.forEach(({ sem1, sem2, sem3, sem4, sem5 }) => {
      const course_array = [sem1, sem2, sem3, sem4, sem5];
      course_array.forEach((course) => {
        if (id === course) {
          overload++;
        }
      });
    });

    if (overload > maxClassSize) {
      overloadInfo.push({
        OVERLOAD: id,
        MaxSize: maxClassSize,
        Chose: overload,
        Exceed: overload - maxClassSize,
      });
    } else if (overload == maxClassSize) {
      overloadInfo.push({
        FULL: id,
        MaxSize: maxClassSize,
        Chose: overload,
      });
    } else {
      overloadInfo.push({
        Normal: id,
        MaxSize: maxClassSize,
        Chose: overload,
      });
    }
  });
  return overloadInfo.sort((a, b) => {
    {
      if (a.Chose > b.Chose) {
        return -1;
      }
      if (a.Chose < b.Chose) {
        return 1;
      }
      return 0;
    }
  });
};

function update_reg_status(reg_database) {
  const updateStatus = reg_database
    .map(({ id, maxClassSize, registered }) => {
      if (registered > maxClassSize) {
        return {
          OVERLOAD: id,
          MaxSize: maxClassSize,
          Registered: registered,
          Exceed: registered - maxClassSize,
        };
      } else if (registered == maxClassSize) {
        return {
          FULL: id,
          MaxSize: maxClassSize,
          Registered: registered,
        };
      } else {
        return {
          Normal: id,
          MaxSize: maxClassSize,
          Registered: registered,
        };
      }
    })
    .sort((a, b) => {
      return b.Registered - a.Registered;
    });
  console.log(updateStatus);
}

function getPreRegStats(sortedResult) {
  const total_capacity = sortedbyRegister.reduce((total, { MaxSize }) => {
    return total + MaxSize;
  }, 0);

  const total_Chose = sortedbyRegister.reduce((total, { Chose }) => {
    return total + Chose;
  }, 0);
  console.log(
    "Total capacity: " + total_capacity + " Total Chose: " + total_Chose
  );
  return { total_capacity, total_Chose };
}

function getSemRegDatabasePath(pathName = "import") {
  if (pathName === "import") {
    return JSON.parse(
      fs.readFileSync("import_data/Seminar-Registration.json", "utf-8")
    );
  } else {
    return JSON.parse(
      fs.readFileSync(
        "intermediate_data/new_Seminar-Registration.json",
        "utf-8"
      )
    );
  }
}
const students_reg = getSemRegDatabasePath("intermediate");
const curr_seminar_id = get_curr_seminar_id(students_reg);
const curr_sem_info = get_curr_sem_info(seminars_info, curr_seminar_id);
const curr_sems_targetGrade = get_curr_sem_targetGrade(curr_sem_info);
const sortedbyRegister = checkOverloadedCourses(curr_sem_info, students_reg);
const courseTimeConflicts = checkCourseTimeConflicts(curr_sem_info);
const preRegStats = getPreRegStats(sortedbyRegister);
//module.exports.courseTimeConflicts = courseTimeConflicts;
module.exports.update_reg_status = update_reg_status;
module.exports.curr_seminar_id = curr_seminar_id;
module.exports.curr_sem_info = curr_sem_info;
module.exports.current_seminars_targetGrade = curr_sems_targetGrade;
module.exports.courseStatus = sortedbyRegister;
module.exports.preRegStats = preRegStats;
// console.log(courseTimeConflicts);

// console.log(sortedbyRegister);
// console.log(preRegStats);
const all_course_conflict_pairs = courseConflictsPairs(curr_sem_info);
module.exports.all_course_conflict_pairs = all_course_conflict_pairs;
