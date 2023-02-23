const User = require("../database/models/User");

const router = require("express").Router();

const authMiddleware = require("../auth/auth.middlewares");

router.get("/", authMiddleware.checkUser, async function (req, res, next) {
  if (!req.query) return res.status(400).json({ message: "Invalid Time" });
  const { year, month, date } = req.query;
  const hourStart = req.query.h_start;
  const hourEnd = req.query.h_end;
  const startTime = new Date(year, month, date, hourStart).getTime();
  const endTime = new Date(year, month, date, hourEnd).getTime();
  console.log(startTime);
  console.log(endTime);
  const waterListData = req.user.water[`${year}_${month}_${date}`];

  if (!waterListData) return res.status(400).json({ message: "Invalid Time" });
  let timeKeyResult;
  for (let key in waterListData) {
    const timeKey = parseInt(key);
    console.log(timeKey);
    if (startTime <= timeKey && timeKey <= endTime) {
      timeKeyResult = timeKey;
      break;
    }
  }

  return res.status(200).json(waterListData[timeKeyResult]);
});

module.exports = router;
