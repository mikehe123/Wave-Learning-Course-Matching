const fs = require("fs");
let students_reg = JSON.parse(fs.readFileSync("students-reg.json", "utf-8"));
let seminars_info = JSON.parse(fs.readFileSync("seminars_info.json", "utf-8"));

//get all current seminars name
const current_seminars_id = new Set();
students_reg.forEach(({ sem1, sem2, sem3, sem4, sem5 }) => {
  current_seminars_id.add(sem1);
  current_seminars_id.add(sem2);
  current_seminars_id.add(sem3);
  current_seminars_id.add(sem4);
  current_seminars_id.add(sem5);
});
current_seminars_id.delete("");
current_seminars_id.delete("seminar999");
exports.current_seminars_id = current_seminars_id;
//console.log(current_seminars_id);

//get current seminars's info
const current_seminars_infos = new Set();
seminars_info.forEach(
  ({
    id,
    classTimes,
    classDays,
    maxClassSize,
    targetAudience,
    courseTitle,
  }) => {
    if (current_seminars_id.has(id)) {
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

exports.current_seminars_infos = current_seminars_infos;

const current_seminars_targetGrade = [];
current_seminars_infos.forEach((seminar) => {
  let name = seminar.id;
  current_seminars_targetGrade.push([name, seminar.targetAudience]);
});
exports.current_seminars_targetGrade = current_seminars_targetGrade;
console.log(current_seminars_targetGrade);
//check conflicts time
//console.log(current_seminars_targetGrade);
function checkCourseTimeConflicts() {
  let time = 1;
  while (time != 13) {
    console.log("==============Group" + time + "==================");
    current_seminars_infos.forEach(({ id, classTimes, classDays }) => {
      let time_string = time.toString();

      if (classTimes.includes(time_string)) {
        console.log({ id, classTimes, classDays });
      }
    });
    time++;
  }
}
exports.checkCourseTimeConflicts = checkCourseTimeConflicts;

//check what seminars are overloaded;

const checkOverloadedCourses = () => {
  let overloadInfo = [];
  current_seminars_infos.forEach(({ id, maxClassSize }) => {
    let overload = 0;
    students_reg.forEach(({ sem1, sem2, sem3, sem4, sem5 }) => {
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
  return overloadInfo;
};
//console.log(checkOverloadedCourses());
const sortedbyRegister = checkOverloadedCourses().sort((a, b) => {
  return b.Registered - a.Registered;
});
exports.courseStatus = sortedbyRegister;

const total_capacity = sortedbyRegister.reduce((total, { MaxSize }) => {
  return total + MaxSize;
}, 0);

const total_Chose = sortedbyRegister.reduce((total, { Chose }) => {
  return total + Chose;
}, 0);

exports.total_capacity = total_capacity;
exports.total_Chose = total_Chose;
console.log(
  "Total capacity: " + total_capacity + " Total Chose: " + total_Chose
);
