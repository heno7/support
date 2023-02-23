const express = require("express");
const { checkUser } = require("./auth.middlewares");
const router = express.Router();

const authController = require("./auth.controller");

router.post("/login", authController.login);

module.exports = router;
