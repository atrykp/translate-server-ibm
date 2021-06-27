const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const AppError = require("./utils/appError");

const translateRouter = require("./routes/translate");
const userRouter = require("./routes/users");

const app = express();

const allowedOrigins = [
  "https://pensive-lalande-2ecd72.netlify.app",
  "http://localhost:3000",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

const port = process.env.PORT || 5000;

app.use(express.json({ limit: "1mb" }));
app.use("/translator", translateRouter);
app.use("/api/users", userRouter);

app.listen(port);

mongoose.connect(
  process.env.MONGODB_LINK,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("Database Connected...")
);

app.all("*", (req, res, next) => {
  next(new AppError(`Cant find route ${req.originalUrl}`), 404);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
