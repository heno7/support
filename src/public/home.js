let now = new Date();
let globalYear = now.getFullYear();
let globalMonth = now.getMonth();
let globalDay = now.getDate();
let isFeb = false;
let elementsContainer = {};
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

window.addEventListener("load", () => {
  fullFillElementsContainer();
  const timeNav = document.getElementById("time-nav");
  timeNav.addEventListener("click", (e) => {
    const idTarget = e.target.getAttribute("id");
    if (idTarget === "year") {
      let now = new Date();
      let currentYear = now.getFullYear();
      chooseYears(2023, currentYear);
    } else if (idTarget === "month") {
      chooseMonths();
    } else if (idTarget === "day") {
      chooseDays();
    }
  });
});

function fullFillElementsContainer() {
  const yearPicker = document.getElementById("year-picker");
  const yearDisplay = document.getElementById("year-display");

  elementsContainer.yearPicker = yearPicker;
  elementsContainer.yearDisplay = yearDisplay;

  const monthPicker = document.getElementById("month-picker");
  const monthDisplay = document.getElementById("month-display");

  elementsContainer.monthPicker = monthPicker;
  elementsContainer.monthDisplay = monthDisplay;

  const dayPicker = document.getElementById("day-picker");
  const dayDisplay = document.getElementById("day-display");

  elementsContainer.dayPicker = dayPicker;
  elementsContainer.dayDisplay = dayDisplay;
}

function chooseYears(start, end) {
  const { yearPicker, yearDisplay } = elementsContainer;
  clearPicker("month");
  clearPicker("day");

  yearDisplay.style.display = "none";
  yearPicker.style.display = "block";
  yearPicker.innerHTML = "";
  for (let i = start; i <= end; i++) {
    let year = i;
    let liEle = document.createElement("li");
    liEle.textContent = year;
    yearPicker.appendChild(liEle);
  }

  const onClickPicker = (e) => {
    yearPicker.removeEventListener("click", onClickPicker);
    const year = e.target.textContent;
    yearDisplay.style.display = "block";
    yearDisplay.textContent = year;
    yearPicker.style.display = "none";
    globalYear = year;
  };

  yearPicker.addEventListener("click", onClickPicker);
}

function chooseMonths() {
  const { monthPicker, monthDisplay } = elementsContainer;

  clearPicker("year");
  clearPicker("day");

  monthDisplay.style.display = "none";
  monthPicker.style.display = "block";
  monthPicker.innerHTML = "";

  for (let month of months) {
    let liEle = document.createElement("li");
    liEle.textContent = month;
    monthPicker.appendChild(liEle);
  }

  const onClickPicker = (e) => {
    monthPicker.removeEventListener("click", onClickPicker);
    const month = e.target.textContent;
    monthDisplay.style.display = "block";
    monthDisplay.textContent = month;
    monthPicker.style.display = "none";
    globalMonth = months.indexOf(month);

    if (globalMonth === 1) {
      globalMonth += 1;
      isFeb = true;
    }

    isFeb = false;
  };

  monthPicker.addEventListener("click", onClickPicker);
}

function chooseDays() {
  const { dayPicker, dayDisplay } = elementsContainer;

  clearPicker("year");
  clearPicker("month");

  dayDisplay.style.display = "none";
  dayPicker.style.display = "block";
  dayPicker.innerHTML = "";
  const getDays = (year, month) => {
    return new Date(year, month, 0).getDate();
  };
  const numberDaysOfCurrentMonth = getDays(globalYear, globalMonth);
  for (let day = 1; day <= numberDaysOfCurrentMonth; day++) {
    let liEle = document.createElement("li");
    liEle.textContent = day;
    dayPicker.appendChild(liEle);
  }

  const onClickPicker = (e) => {
    dayPicker.removeEventListener("click", onClickPicker);
    const day = e.target.textContent;
    dayDisplay.style.display = "block";
    dayDisplay.textContent = day;
    dayPicker.style.display = "none";
    globalDay = day;
  };

  dayPicker.addEventListener("click", onClickPicker);
}

function clearPicker(time) {
  const {
    yearPicker,
    yearDisplay,
    monthPicker,
    monthDisplay,
    dayPicker,
    dayDisplay,
  } = elementsContainer;
  if (time === "year") {
    yearPicker.style.display = "none";
    yearDisplay.textContent = globalYear;
  }

  if (time === "month") {
    monthPicker.style.display = "none";
    if (isFeb) return (monthDisplay.textContent = months[globalMonth - 1]);
    monthDisplay.textContent = months[globalMonth];
  }

  if (time === "day") {
    dayPicker.style.display = "none";
    dayDisplay.textContent = globalDay;
  }
}
