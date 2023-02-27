// const User = require("../database/models/User");

const authMiddleware = require("../auth/auth.middlewares");

const waterServices = require("./water.services");

const router = require("express").Router();

router.use(authMiddleware.checkUser);

router.get("/", function (req, res, next) {
  if (!req.query) return res.status(400).json({ message: "Invalid Time" });

  const time = waterServices.extractTime(req.query);

  const isValidTime = waterServices.checkValidTime(time);

  if (!isValidTime) return res.status(400).json({ message: "Invalid Time" });

  const type = waterServices.checkTypeOfTimeQuery(time);

  let data;
  if (type === "year") {
    data = waterServices.findWaterDataInAYear(time, req.user);
  }
  if (type === "month") {
    data = waterServices.findWaterDataInAMonth(time, req.user);
  }
  if (type === "day") {
    data = waterServices.findWaterDataInADay(time, req.user);
  }
  if (type === "hour") {
    data = waterServices.findWaterDataInAnHour(time, req.user);
  }

  return res.status(200).json({ ...data });
});

router.get("/bill", function (req, res, next) {
  if (!req.query) return res.status(400).json({ message: "Invalid Time" });

  const time = waterServices.extractTime(req.query);

  const isValidTime = waterServices.checkValidTime(time);
  if (!isValidTime) return res.status(400).json({ message: "Invalid Time" });

  const type = waterServices.checkTypeOfTimeQuery(time);
  let data;
  if (type === "year") {
    data = waterServices.findWaterDataInAYear(time, req.user);
  }
  if (type === "month") {
    console.log("Here");
    data = waterServices.findWaterDataInAMonth(time, req.user);
    // console.log(data);
  }
  if (type === "day") {
    data = waterServices.findWaterDataInADay(time, req.user);
  }
  return res
    .status(200)
    .json({ totalMoney: waterServices.calTotalMoney(data) });
});

module.exports = router;
