const JWT = require("jsonwebtoken");
const User = require("../database/models/User");

module.exports = {
  checkAdmin: function (req, res, next) {
    // const token = req.body.token;
    // console.log(req.headers);
    const token = req.headers["authorization"].slice(6).trim();

    if (!token) {
      return res.status(401).json({ message: "you do not have permission" });
    }
    JWT.verify(token, process.env.JWT_SECRECT, function (err, decoded) {
      if (err)
        return res.status(403).json({ message: "Unauthorization Access" });
      if (decoded.admin) return next();
      return res.status(403).json({ message: "Unauthorization Access" });
    });
  },

  checkUser: function (req, res, next) {
    // const token = req.body.token;
    const token = req.headers["authorization"].slice(6).trim();

    if (!token) {
      return res.status(401).json({ message: "you do not have permission" });
    }

    JWT.verify(token, process.env.JWT_SECRECT, function (err, decoded) {
      if (err) {
        return res.status(403).json({ message: "Unauthorization Access" });
      }

      if (decoded.admin) {
        User.findById(req.query.userId, (error, user) => {
          if (user) {
            req.user = user;
            return next();
          }
          // User.findById(decoded.id, (error, user) => {
          //   if (user) {
          //     req.user = user;
          //     return next();
          //   }
          // });
        });
      } else {
        User.findById(decoded.id, (error, user) => {
          if (user) {
            req.user = user;
            return next();
          }
        });
      }
    });
  },
};
