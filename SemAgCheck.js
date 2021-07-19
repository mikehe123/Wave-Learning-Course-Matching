const csv = require("csv-parser");
const fs = require("fs");
const reg_records_bySems = JSON.parse(
  fs.readFileSync("export_data/registration_record_by_seminars.json", "utf-8")
);

let preRegSize = 0;
let preparedRecord = reg_records_bySems.map((sem_record) => {
  const { id, groups } = sem_record;
  let groupEmail = groups.map(({ email }) => {
    return email;
  });

  const semGroup = new Set(groupEmail);
  preRegSize += semGroup.size;
  return [id, semGroup];
});

function checkToRemoveAg(semId, stuEmail, reg_record) {
  reg_record.forEach(([id, semGroup]) => {
    if (semId.includes(id)) {
      semGroup.forEach((emailEntry) => {
        if (stuEmail.includes(emailEntry)) {
          semGroup.delete(emailEntry);
        }
      });
    }
  });
}

fs.createReadStream("import_data/Seminar-Assignments.csv")
  .pipe(csv())
  .on("data", (data) => {
    for (var propName in data) {
      if (data.hasOwnProperty(propName)) {
        var propValue = data[propName];
        let semId = propValue.split("\t")[0];
        let stuEmail = propValue.split("\t")[1];

        checkToRemoveAg(semId, stuEmail, preparedRecord);
        let afterRegSize = 0;
        preparedRecord.forEach(([id, semGroup]) => {
          afterRegSize += semGroup.size;
        });

        console.log(
          "Before regSize: " + preRegSize + " After regSize: " + afterRegSize
        );
      }
    }
  })
  .on("end", () => {
    //console.log(preparedRecord);
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
  });
