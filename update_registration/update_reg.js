const fs = require("fs");
const prev_reg_data = JSON.parse(
  fs.readFileSync(
    "../intermediate_data/prev_registration_datebase.json",
    "utf-8"
  )
);
const prev_reg_ag = JSON.parse(
  fs.readFileSync("../intermediate_data/prev_SeminarAssignments.json", "utf-8")
);

console.log(prev_reg_data);
//console.log(prev_reg_ag);
