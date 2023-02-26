require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();

const authRoutes = require("./auth/auth.routes");
const waterRoutes = require("./water/water.routes");
const adminRoutes = require("./admin/admin.routes");

const cors = require("cors");

const compression = require("compression");
app.use(compression());

const helmet = require("helmet");
app.use(helmet({ contentSecurityPolicy: false }));

const connectDB = require("./database/connect");

connectDB();

const initMQQT = require("./mqqt");
initMQQT();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.use("/api/water", waterRoutes);

app.use("/api/admin", adminRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  let message = "Internal Server Error";

  // if (statusCode >= 500) console.log(error);

  if (statusCode === 400) message = error.message;
  res.status(statusCode).json({ message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running...");
});

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});
