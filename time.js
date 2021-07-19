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

  console.log(sT, eT, sT2, eT2);
  return sT < eT2 && sT2 < eT;
}

let time1 = "12:00 - 1:30pm";
let time2 = "12:00 - 1:00pm";
console.log("Test: " + isOverlap(time1, time2));

time1 = "12:00 - 2:00pm";
time2 = "1:00 - 1:30pm";
console.log("Test: " + isOverlap(time1, time2));

time1 = "2:00 - 3:30pm";
time2 = "1:00 - 4:00pm";
console.log("Test: " + isOverlap(time1, time2));

time1 = "1:00 - 2:30pm";
time2 = "12:00 - 1:00pm";
console.log("Test: " + isOverlap(time1, time2));

time1 = "12:00 - 1:30pm";
time2 = "12:00 - 1:30pm";
console.log("Test: " + isOverlap(time1, time2));

time1 = "1:00 - 2:30pm";
time2 = "2:00 - 4:00pm";
console.log("Test: " + isOverlap(time1, time2));
