function findWaterDataInAnHour(time, user) {
  const { year, month, date, hourStart, hourEnd } = time;

  const startTime = new Date(year, month, date, hourStart).getTime();
  const endTime = new Date(year, month, date, hourEnd).getTime();

  const waterListData = user.water[`${year}_${month}_${date}`];

  let timeKeyResult;
  for (let key in waterListData) {
    const timeKey = parseInt(key);
    if (startTime <= timeKey && timeKey <= endTime) {
      timeKeyResult = timeKey;
      break;
    }
  }
  return waterListData[timeKeyResult];
}

function findWaterDataInADay(time, user) {
  const { year, month, date } = time;
  // console.log(user);
  let waterListData = user.water[`${year}_${month}_${date}`];
  // console.log(waterListData);

  if (!waterListData) {
    waterListData = {
      emptyData: {
        cold: {
          volumn: 0,
        },
        hot: {
          volumn: 0,
          temp: 0,
        },
      },
    };
  }
  let totalColdVolumn = 0;
  let totalHotVolumn = 0;
  let totalHotTemp = 0;
  let count = 0;

  for (key in waterListData) {
    totalColdVolumn += parseInt(waterListData[key].cold.volumn);
    totalHotVolumn += parseInt(waterListData[key].hot.volumn);
    totalHotTemp += parseInt(waterListData[key].hot.temp);
    count++;
  }

  // console.log(count);

  return {
    cold: {
      volumn: totalColdVolumn,
    },
    hot: {
      volumn: totalHotVolumn,
      temp: totalHotTemp / count,
    },
  };
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function findWaterDataInAMonth(time, user) {
  const { year, month } = time;
  let totalDaysInMonth = daysInMonth(year, month);
  const now = new Date();
  if (year === now.getFullYear() && month === now.getMonth()) {
    totalDaysInMonth = now.getDate();
  }

  let totalColdVolumn = 0;
  let totalHotVolumn = 0;
  let totalHotTemp = 0;
  let count = 0;
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const result = findWaterDataInADay({ year, month, day }, user);
    totalColdVolumn += result.cold.volumn;
    totalHotVolumn += result.hot.volumn;
    totalHotTemp += result.hot.temp;
    count++;
  }

  // console.log(count);

  return {
    cold: {
      volumn: totalColdVolumn,
    },
    hot: {
      volumn: totalHotVolumn,
      temp: totalHotTemp / count,
    },
  };
}

function findWaterDataInAYear(time, user) {
  const { year } = time;
  let totalMonths = 11;
  const now = new Date();
  if (year === now.getFullYear()) totalMonths = now.getMonth();

  let totalColdVolumn = 0;
  let totalHotVolumn = 0;
  let totalHotTemp = 0;
  let count = 0;
  for (let month = 0; month <= totalMonths; month++) {
    const result = findWaterDataInAMonth({ year, month }, user);
    totalColdVolumn += result.cold.volumn;
    totalHotVolumn += result.hot.volumn;
    totalHotTemp += result.hot.temp;
    count++;
  }

  return {
    cold: {
      volumn: totalColdVolumn,
    },
    hot: {
      volumn: totalHotVolumn,
      temp: totalHotTemp / count,
    },
  };
}

function extractTime(timeQuery) {
  let { year, month, date } = timeQuery;
  let hourStart = timeQuery.h_start;
  let hourEnd = timeQuery.h_end;
  year = parseInt(year);
  month = parseInt(month);
  date = parseInt(date);
  hourStart = parseInt(hourStart);
  hourEnd = parseInt(hourEnd);
  return { year, month, date, hourStart, hourEnd };
}

function checkValidTime(time) {
  let { year, month, date, hourStart, hourEnd } = time;

  const now = new Date();
  if (year > now.getFullYear()) return false;
  if (year === now.getFullYear() && month > now.getMonth()) return false;
  if (
    year === now.getFullYear() &&
    month === now.getMonth() &&
    date > now.getDate()
  )
    return false;
  if (
    year === now.getFullYear() &&
    month === now.getMonth() &&
    date === now.getDate() &&
    hourEnd > now.getHours()
  )
    return false;
  if (!year) return false;
  if (!month && (date || hourStart || hourEnd)) return false;
  if (!date && (hourStart || hourEnd)) return false;
  return true;
}

function checkTypeOfTimeQuery(time) {
  const { year, month, date, hourStart, hourEnd } = time;
  if (year && !month) return "year";
  if (month && !date) return "month";
  if (date && !hourStart && !hourEnd) return "day";
  return "hour";
}

function calColdBill(coldWaterUsedData) {
  const coldWaterUsed = coldWaterUsedData.volumn;
  if (coldWaterUsed <= 10) {
    return 6500 * coldWaterUsed;
  }
  if (coldWaterUsed <= 20) {
    return 6500 * 10 + 8500 * (coldWaterUsed - 10);
  }
  if (coldWaterUsed <= 30) {
    return 6500 * 10 + 8500 * 10 + 10500 * (coldWaterUsed - 20);
  }
  return 6500 * 10 + 8500 * 10 + 10500 * 10 + 14000 * (coldWaterUsed - 30);
}

function calHotBill(hotWaterUsed) {
  if (hotWaterUsed.temp <= 60) {
    return 50000 * hotWaterUsed.volumn;
  }
  if (hotWaterUsed.temp <= 70) {
    return 60000 * hotWaterUsed.volumn;
  }
  if (hotWaterUsed.temp <= 90) {
    return 70000 * hotWaterUsed.volumn;
  }
  return 80000 * hotWaterUsed.volumn;
}

function calTotalMoney(data) {
  const { cold, hot } = data;
  const totalMoney = calColdBill(cold) + calHotBill(hot);
  return totalMoney;
}

module.exports = {
  findWaterDataInAnHour,
  findWaterDataInADay,
  findWaterDataInAMonth,
  findWaterDataInAYear,
  extractTime,
  checkValidTime,
  checkTypeOfTimeQuery,
  calColdBill,
  calHotBill,
  calTotalMoney,
};
