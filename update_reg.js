const fs = require("fs");
const read_prev_reg = JSON.parse(
  fs.readFileSync("intermediate_data/prev_registration_datebase.json", "utf-8")
);
const prev_reg_ag = JSON.parse(
  fs.readFileSync("intermediate_data/prev_SeminarAssignments.json", "utf-8")
);

const prev_Stu_Pro = JSON.parse(
  fs.readFileSync("import_data/Student-Profiles.json", "utf-8")
);
const prev_Sem_Reg = JSON.parse(
  fs.readFileSync("import_data/Seminar-Registration.json", "utf-8")
);
const new_Stu_Pro = JSON.parse(
  fs.readFileSync("intermediate_data/new_Student-Profiles.json", "utf-8")
);
const new_Sem_Reg = JSON.parse(
  fs.readFileSync("intermediate_data/new_Seminar-Registration.json", "utf-8")
);

const {
  joinStuInfo,
  old_join_db,
  students_with_no_repeat_account,
  batchStudentByNumSeminar,
  writeEdInfo,
  writeParentInfo,
  writeWaitlist,
} = require("./batch_students.js");

const updated_join_stu_info = joinStuInfo(new_Sem_Reg, new_Stu_Pro);

function extractNewStu(updateDB, oldDB) {
  const oldDBMap = new Map();
  oldDB.forEach(({ email, studentName }) => {
    //console.log(email, studentName);
    oldDBMap.set(email, studentName);
  });

  let newStudents = [];
  updateDB.forEach((Student) => {
    const { studentName, email } = Student;
    if (oldDBMap.get(email) !== studentName) {
      newStudents.push(Student);
    }
  });
  return newStudents;
}
const new_join_stu_Info = extractNewStu(updated_join_stu_info, old_join_db);
const completeClean = students_with_no_repeat_account(new_join_stu_Info);
const completeBatches = batchStudentByNumSeminar(
  completeClean[0],
  completeClean[1]
);

const {
  mainAlgorithm,
  displayFinalRegResult,
  resultToJson,
  splitStudentAssigment,
  compareRegDatabase,
  compareSemAssignments,
  checkRegStats,
  writeSeminarAssignments,
  checkStuGotFirstChoice,
} = require("./registration_alg.js");

const { getPreRegStats } = require("./info_func");
//run main alg
let updated_registration = read_prev_reg;
let updated_stu_batches = completeBatches;
mainAlgorithm(updated_stu_batches, updated_registration, 5, 5, false);
mainAlgorithm(updated_stu_batches, updated_registration, 5, 5, true);
displayFinalRegResult(updated_registration);
compareRegDatabase(updated_registration);
checkRegStats(updated_stu_batches);
const upSplitRegResult = resultToJson(updated_stu_batches);
const updated_finalRegResult = splitStudentAssigment(upSplitRegResult);
compareSemAssignments(updated_finalRegResult);
checkStuGotFirstChoice(new_Sem_Reg, updated_stu_batches);

//writeSeminarAssignments(updated_finalRegResult, "Updated");
//writeEdInfo(updated_stu_batches, updated_finalRegResult, "Updated");
//writeParentInfo(completeBatches, "Updated");
//writeWaitlist(updated_stu_batches, updated_finalRegResult, "Updated");
//console.log(updated_registration);
