const fs = require("fs");
const { regResultWithAllAssignCourses } = require("./registration_alg.js");
let students_reg = JSON.parse(fs.readFileSync("students-reg.json", "utf-8"));

console.log(regResultWithAllAssignCourses);
let student_got_first_choice = 0;
students_reg.forEach((Student) => {
  const { sem1, email } = Student;
  regResultWithAllAssignCourses.forEach((matchedStudent) => {
    const { seminarArr } = matchedStudent;
    if (sem1 === seminarArr[0] && email === matchedStudent.student) {
      student_got_first_choice++;
    }
  });
});
console.log(student_got_first_choice + " students got their first choice");
