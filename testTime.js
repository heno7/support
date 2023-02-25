// const time = new Date(1677160800000);
// console.log(time.getFullYear());
// console.log(time.getMonth());

// console.log(time.getDate());

// console.log(time.getHours());

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// July
console.log(daysInMonth(2023, 4)); // 31
// February
// daysInMonth(2, 2009); // 28
// daysInMonth(2, 2008); // 29
