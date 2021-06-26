function filter1(target, grade, gradeline = 0) {
  let min = 9;
  let max = 9;
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

function filter2 (target, grade, gradeline = 0) {
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

  console.log(filter1.toString() == filter2.toString() )