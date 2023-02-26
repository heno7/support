const User = require("../database/models/User");

const authMiddleware = require("../auth/auth.middlewares");

const router = require("express").Router();

router.get("/users", authMiddleware.checkAdmin, async (req, res, next) => {
  const users = await User.find({ admin: false }).select(
    "username email deviceId"
  );

  return res.status(200).json({ users });
});

module.exports = router;
